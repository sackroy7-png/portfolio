// node render.cjs beats|full|audio
// beats : une image par temps (planche de contrôle)
// audio : bande-son WAV (Web Audio, OfflineAudioContext)
// full  : 60 i/s, 3 sous-images par image (mélangées ensuite par ffmpeg tmix)
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const mode = process.argv[2] || "beats";
const dir = __dirname;
const out = path.join(dir, "build", mode === "full" ? "sub" : mode);

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("file://" + path.join(dir, "index.html"));
  await page.evaluate(() => window.ready);

  if (mode === "audio") {
    const b64 = await page.evaluate(() => window.renderAudio());
    fs.writeFileSync(path.join(dir, "build", "audio.wav"), Buffer.from(b64, "base64"));
  } else {
    const times = mode === "full"
      ? [...Array(35 * 180)].map((_, n) => n / 180).slice(0, process.argv[3] ? +process.argv[3] : undefined)
      : [...Array(70)].map((_, n) => n * 0.5 + (process.argv[3] ? +process.argv[3] : 0.3));
    for (let n = 0; n < times.length; n++) {
      await page.evaluate((t) => window.seek(t), times[n]);
      await page.screenshot({ path: path.join(out, `f${String(n).padStart(5, "0")}.jpg`), type: "jpeg", quality: mode === "full" ? 93 : 80 });
    }
  }
  console.log(mode, "ok", errors.length ? errors.slice(0, 5) : "no errors");
  await browser.close();
})();
