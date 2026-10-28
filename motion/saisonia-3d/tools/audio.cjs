// node tools/audio.cjs → assets/soundtrack-raw.wav (Web Audio, OfflineAudioContext)
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto("file://" + path.join(__dirname, "audio.html"));
  const b64 = await p.evaluate(() => window.renderAudio());
  fs.writeFileSync(path.join(__dirname, "..", "assets", "soundtrack-raw.wav"), Buffer.from(b64, "base64"));
  await b.close(); console.log("ok");
})();
