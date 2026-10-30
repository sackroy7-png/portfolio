#!/usr/bin/env python3
"""État d'une simulation de public (monde, tours, rapport).

  world.py init    world.json spec.json        crée le monde
  world.py round   world.json round.json       ajoute un tour (met à jour avis et mémoires)
  world.py stats   world.json                  avis par segment et global, à chaque tour
  world.py feed    world.json <agent>          ce que ce personnage a vu au dernier tour
  world.py agent   world.json <agent>          fiche + mémoire d'un personnage
  world.py predict world.json prediction.json  enregistre la prédiction
  world.py report  world.json rapport.html     page HTML autonome
"""
import html
import json
import sys

FAV, OPP = 0.2, -0.2  # seuils « plutôt pour » / « plutôt contre »


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def clamp(x):
    return max(-1.0, min(1.0, float(x)))


def agents_by_id(w):
    return {a["id"]: a for a in w["agents"]}


def cmd_init(world_path, spec_path):
    spec = load(spec_path)
    seg_ids = {s["id"] for s in spec["segments"]}
    ids = set()
    for a in spec["agents"]:
        if a["segment"] not in seg_ids:
            sys.exit(f"Personnage {a['id']} : segment inconnu « {a['segment']} »")
        if a["id"] in ids:
            sys.exit(f"Identifiant en double : {a['id']}")
        ids.add(a["id"])
    for a in spec["agents"]:
        a["stance"] = clamp(a.get("stance", 0))
        a["influence"] = max(0.0, min(1.0, float(a.get("influence", 0.3))))
        a["follows"] = [f for f in a.get("follows", []) if f in ids and f != a["id"]]
        a["memory"] = []
        a["history"] = [a["stance"]]
    spec["rounds"] = []
    spec.setdefault("assumptions", [])
    save(world_path, spec)
    print(f"Monde créé : {len(spec['segments'])} segments, {len(spec['agents'])} personnages.")


def cmd_round(world_path, round_path):
    w, r = load(world_path), load(round_path)
    by_id = agents_by_id(w)
    n = len(w["rounds"]) + 1
    seen = set()
    for act in r["actions"]:
        a = by_id.get(act["agent"])
        if not a:
            sys.exit(f"Personnage inconnu : {act['agent']}")
        if act.get("type") not in ("post", "comment", "share", "ignore"):
            sys.exit(f"Type d'action inconnu pour {a['id']} : {act.get('type')}")
        seen.add(a["id"])
        new = clamp(act.get("stance", a["stance"]))
        a["stance"] = new
        note = f"T{n} · {act['type']}"
        if act.get("target"):
            note += f" → {act['target']}"
        if act.get("text"):
            note += f" : {act['text']}"
        a["memory"].append(note)
    for a in w["agents"]:
        a["history"].append(a["stance"])
        if a["id"] not in seen:
            a["memory"].append(f"T{n} · (aucune action)")
    w["rounds"].append({"n": n, "event": r.get("event", ""), "actions": r["actions"]})
    save(world_path, w)
    print(f"Tour {n} ajouté ({len(seen)}/{len(w['agents'])} personnages).")
    print_stats(w, last_only=True)


def segment_stats(w, t):
    """Avis moyen (pondéré par l'influence) de chaque segment à l'instant t."""
    out = {}
    for s in w["segments"]:
        members = [a for a in w["agents"] if a["segment"] == s["id"]]
        if not members:
            continue
        wts = [0.5 + a["influence"] for a in members]
        vals = [a["history"][t] for a in members]
        mean = sum(v * k for v, k in zip(vals, wts)) / sum(wts)
        fav = sum(k for v, k in zip(vals, wts) if v >= FAV) / sum(wts)
        opp = sum(k for v, k in zip(vals, wts) if v <= OPP) / sum(wts)
        out[s["id"]] = {"mean": mean, "fav": fav, "opp": opp, "size": s.get("size", 1)}
    return out


def global_stats(seg):
    total = sum(v["size"] for v in seg.values()) or 1
    return {k: sum(v[k] * v["size"] for v in seg.values()) / total for k in ("mean", "fav", "opp")}


def print_stats(w, last_only=False):
    T = len(w["rounds"])
    names = {s["id"]: s["name"] for s in w["segments"]}
    rng = [T] if last_only else range(T + 1)
    for t in rng:
        seg = segment_stats(w, t)
        g = global_stats(seg)
        print(f"\n— Tour {t} — global (pondéré par la taille des segments) : avis {g['mean']:+.2f} · "
              f"pour {g['fav']*100:.0f} % · contre {g['opp']*100:.0f} %")
        for k, v in seg.items():
            print(f"   {names[k]:<34} {v['mean']:+.2f}  pour {v['fav']*100:3.0f} %  contre {v['opp']*100:3.0f} %")
    if w["rounds"]:
        counts = {}
        for r in w["rounds"]:
            for act in r["actions"]:
                if act.get("target") and act["type"] in ("comment", "share"):
                    counts[act["target"]] = counts.get(act["target"], 0) + 1
        top = sorted(counts.items(), key=lambda x: -x[1])[:5]
        if top:
            by = agents_by_id(w)
            print("\nLes plus repris : " + ", ".join(f"{by[i]['name']} ({c})" for i, c in top if i in by))


def cmd_feed(world_path, agent_id):
    w = load(world_path)
    by = agents_by_id(w)
    a = by[agent_id]
    if not w["rounds"]:
        print("Aucun tour encore : seul le matériau de départ est visible.")
        return
    last = w["rounds"][-1]
    if last.get("event"):
        print(f"[Événement] {last['event']}")
    for act in last["actions"]:
        if act["agent"] in a["follows"] and act["type"] != "ignore":
            who = by[act["agent"]]["name"]
            tgt = f" (à {by[act['target']]['name']})" if act.get("target") in by else ""
            print(f"{who} · {act['type']}{tgt} : {act.get('text', '')}")


def cmd_agent(world_path, agent_id):
    a = agents_by_id(load(world_path))[agent_id]
    print(json.dumps({k: a[k] for k in a if k != "history"}, ensure_ascii=False, indent=2))
    print("Évolution de l'avis :", " → ".join(f"{v:+.2f}" for v in a["history"]))


def cmd_predict(world_path, pred_path):
    w = load(world_path)
    w["prediction"] = load(pred_path)
    save(world_path, w)
    print("Prédiction enregistrée.")


# ---------------------------------------------------------------- Rapport HTML

PALETTE = ["#316fdf", "#e0763a", "#2a9d8f", "#9b5de5", "#c44569", "#6c757d"]


def chart_svg(w):
    T = len(w["rounds"])
    W_, H_, L, R, TOP, B = 760, 300, 48, 150, 20, 36
    xs = lambda t: L + (W_ - L - R) * (t / max(1, T))
    ys = lambda v: TOP + (H_ - TOP - B) * (1 - (v + 1) / 2)
    series = []
    for i, s in enumerate(w["segments"]):
        pts = [segment_stats(w, t).get(s["id"], {}).get("mean") for t in range(T + 1)]
        series.append((s["name"], PALETTE[i % len(PALETTE)], pts, 2))
    series.append(("Global (pondéré)", "var(--ink)", [global_stats(segment_stats(w, t))["mean"] for t in range(T + 1)], 3.5))
    g = [f'<svg viewBox="0 0 {W_} {H_}" role="img" aria-label="Évolution de l\'avis par segment">']
    for v, lab in ((1, "pour"), (0, "neutre"), (-1, "contre")):
        g.append(f'<line x1="{L}" x2="{W_-R}" y1="{ys(v):.1f}" y2="{ys(v):.1f}" class="grid"/>'
                 f'<text x="{L-8}" y="{ys(v)+4:.1f}" text-anchor="end" class="ax">{lab}</text>')
    for t in range(T + 1):
        g.append(f'<text x="{xs(t):.1f}" y="{H_-12}" text-anchor="middle" class="ax">T{t}</text>')
    labels = []
    for name, col, pts, sw in series:
        p = [(xs(t), ys(v)) for t, v in enumerate(pts) if v is not None]
        d = " ".join(f"{x:.1f},{y:.1f}" for x, y in p)
        g.append(f'<polyline points="{d}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"/>')
        for x, y in p:
            g.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{sw+0.5}" fill="{col}"><title>{html.escape(name)}</title></circle>')
        if p:
            labels.append([p[-1][1], name, col])
    labels.sort()
    for i in range(1, len(labels)):
        labels[i][0] = max(labels[i][0], labels[i - 1][0] + 15)
    for y, name, col in labels:
        g.append(f'<text x="{W_-R+10}" y="{y+4:.1f}" class="lab" fill="{col}">{html.escape(name)}</text>')
    g.append("</svg>")
    return "".join(g)


def cmd_report(world_path, out_path):
    w = load(world_path)
    e = html.escape
    by = agents_by_id(w)
    seg_names = {s["id"]: s["name"] for s in w["segments"]}
    T = len(w["rounds"])
    g0, gT = global_stats(segment_stats(w, 0)), global_stats(segment_stats(w, T))
    p = w.get("prediction", {})
    kpis = [("Avis global", f"{gT['mean']:+.2f}", f"départ {g0['mean']:+.2f}"),
            ("Plutôt pour", f"{gT['fav']*100:.0f} %", f"départ {g0['fav']*100:.0f} %"),
            ("Plutôt contre", f"{gT['opp']*100:.0f} %", f"départ {g0['opp']*100:.0f} %"),
            ("Monde simulé", f"{len(w['agents'])} personnages", f"{sum(s.get('size', 0) for s in w['segments']):,} personnes représentées".replace(",", " "))]
    kpi_html = "".join(f'<div class="kpi"><span>{e(a)}</span><strong>{e(b)}</strong><small>{e(c)}</small></div>' for a, b, c in kpis)

    sc = "".join(f'<article class="card"><h4>{e(s.get("name",""))} <em>{e(s.get("likelihood",""))}</em></h4><p>{e(s.get("text",""))}</p></article>' for s in p.get("scenarios", []))
    segs = "".join(f'<li><b>{e(seg_names.get(s.get("segment"), s.get("segment","")))}</b> — {e(s.get("text",""))}</li>' for s in p.get("segments", []))
    quotes = "".join(f'<blockquote>« {e(q.get("text",""))} »<cite>{e(by.get(q.get("agent"), {}).get("name", q.get("agent","")))}, {e(seg_names.get(by.get(q.get("agent"), {}).get("segment"), ""))}</cite></blockquote>' for q in p.get("quotes", []))
    recos = "".join(f"<li>{e(r)}</li>" for r in p.get("recommendations", []))

    feed = []
    for r in w["rounds"]:
        items = []
        if r.get("event"):
            items.append(f'<li class="event">Événement : {e(r["event"])}</li>')
        for act in r["actions"]:
            if act["type"] == "ignore":
                continue
            a = by[act["agent"]]
            tgt = f' <span class="tgt">→ {e(by[act["target"]]["name"])}</span>' if act.get("target") in by else ""
            items.append(f'<li><b>{e(a["name"])}</b> <span class="seg">{e(seg_names[a["segment"]])}</span> · {e(act["type"])}{tgt}<p>{e(act.get("text",""))}</p></li>')
        ign = sum(1 for act in r["actions"] if act["type"] == "ignore")
        feed.append(f'<details{" open" if r["n"] == T else ""}><summary>Tour {r["n"]} · {len(items)} réactions · {ign} sans réaction</summary><ul class="feed">{"".join(items)}</ul></details>')

    rows = "".join(
        f'<tr><td><b>{e(a["name"])}</b>, {e(str(a.get("age","")))}</td><td>{e(seg_names[a["segment"]])}</td><td>{e(a.get("bio",""))}</td>'
        f'<td class="num">{a["history"][0]:+.1f} → <b>{a["history"][-1]:+.1f}</b></td></tr>' for a in w["agents"])
    assumptions = "".join(f"<li>{e(x)}</li>" for x in w.get("assumptions", []))
    seg_list = "".join(f'<li><b>{e(s["name"])}</b> · ≈ {s.get("size",0):,} pers. — {e(s.get("description",""))}</li>'.replace(",", " ") for s in w["segments"])

    page = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Simulation — {e(w.get("title",""))}</title><style>
:root{{--bg:#f6f7fb;--card:#fff;--ink:#0b1220;--mute:#586071;--line:#e3e6ee;--accent:#316fdf}}
@media (prefers-color-scheme:dark){{:root{{--bg:#0e1118;--card:#171b24;--ink:#eef1f7;--mute:#9aa3b4;--line:#2a3040;--accent:#6b9cff}}}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 system-ui,-apple-system,Segoe UI,Inter,sans-serif}}
main{{max-width:980px;margin:0 auto;padding:40px 16px 80px}}h1{{font-size:clamp(28px,4vw,40px);line-height:1.15;margin:0 0 8px}}
h2{{font-size:22px;margin:48px 0 14px}}h4{{margin:0 0 6px}}h4 em{{font-style:normal;color:var(--accent);margin-left:6px}}
.q{{color:var(--mute);font-size:18px;margin:0 0 24px}}.headline{{font-size:22px;font-weight:650;border-left:4px solid var(--accent);padding:6px 0 6px 16px;margin:24px 0}}
.kpis{{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}}.kpi,.card{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px}}
.kpi span{{display:block;color:var(--mute);font-size:14px}}.kpi strong{{display:block;font-size:26px}}.kpi small{{color:var(--mute)}}
.cards{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}}.card p{{margin:0;color:var(--mute)}}
.chart{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;overflow-x:auto}}svg{{width:100%;min-width:560px;height:auto}}
.grid{{stroke:var(--line)}}.ax{{fill:var(--mute);font-size:12px}}.lab{{font-size:12px;font-weight:600}}
blockquote{{margin:0 0 12px;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px;font-size:17px}}cite{{display:block;color:var(--mute);font-size:14px;font-style:normal;margin-top:6px}}
ul{{padding-left:20px}}li{{margin:6px 0}}details{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px 16px;margin-bottom:10px}}summary{{cursor:pointer;font-weight:600}}
.feed{{list-style:none;padding:0}}.feed li{{border-top:1px solid var(--line);padding:10px 0}}.feed p{{margin:4px 0 0}}.seg,.tgt{{color:var(--mute);font-size:14px}}.event{{color:var(--accent);font-weight:600}}
table{{width:100%;border-collapse:collapse;background:var(--card);border-radius:14px;overflow:hidden}}td{{border-top:1px solid var(--line);padding:10px;vertical-align:top;font-size:15px}}.num{{white-space:nowrap}}
.table{{overflow-x:auto}}.limits{{color:var(--mute);font-size:15px;border-top:1px solid var(--line);margin-top:48px;padding-top:16px}}
</style></head><body><main>
<p class="q">Simulation de public · {T} tours</p>
<h1>{e(w.get("title",""))}</h1><p class="q">{e(w.get("question",""))}</p>
{f'<p class="headline">{e(p["headline"])}</p>' if p.get("headline") else ""}
<div class="kpis">{kpi_html}</div>
<h2>Évolution de l'avis</h2><div class="chart">{chart_svg(w)}</div>
{f'<h2>Scénarios</h2><div class="cards">{sc}</div>' if sc else ""}
{f'<h2>Ce qui fait basculer chaque groupe</h2><ul>{segs}</ul>' if segs else ""}
{f'<h2>Ce qu’ils ont dit</h2>{quotes}' if quotes else ""}
{f'<h2>Recommandations</h2><ul>{recos}</ul>' if recos else ""}
<h2>Le fil de la simulation</h2>{"".join(feed)}
<h2>Le monde simulé</h2><ul>{seg_list}</ul><div class="table"><table>{rows}</table></div>
{f'<h2>Hypothèses</h2><ul>{assumptions}</ul>' if assumptions else ""}
<p class="limits">{e(p.get("limits", "Simulation faite par une IA à partir d’hypothèses : utile pour explorer des scénarios, pas une donnée réelle."))}</p>
</main></body></html>"""
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(page)
    print(f"Rapport écrit : {out_path}")


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    cmd, args = sys.argv[1], sys.argv[2:]
    {"init": cmd_init, "round": cmd_round, "feed": cmd_feed, "agent": cmd_agent, "predict": cmd_predict, "report": cmd_report,
     "stats": lambda p: print_stats(load(p))}.get(cmd, lambda *a: sys.exit(__doc__))(*args)


if __name__ == "__main__":
    main()
