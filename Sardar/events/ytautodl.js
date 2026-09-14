const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cacheDir = path.join(__dirname, "..", "cache", "youtube");
const frames = ["🔍 YouTube link detect hua!\n\n⌛▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒  10%", "🔄 Download link prepare ho raha hai...\n\n⌛▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒  30%", "⚙️ Processing video...\n\n⏳▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒  55%", "📥 Video download ho raha hai...\n\n⏳▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒  75%", "📦 File ready ho raha hai...\n\n⏳▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒  90%", "✅ Complete!\n\n🟢▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100% 😍"];
function extractYtUrl(_0x2d746a) {
  const _0x2d6e25 = _0x2d746a.match(/https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_\-]{11})[^\s]*/i);
  if (!_0x2d6e25) {
    return null;
  }
  return _0x2d6e25[0].split(" ")[0];
}
async function getDownloadUrl(_0x5b4c81, _0x130929) {
  const _0x2edac6 = await axios.get("https://loader.to/ajax/download.php", {
    params: {
      format: _0x130929,
      url: _0x5b4c81
    },
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: "https://loader.to/"
    },
    timeout: 20000,
    validateStatus: () => true
  });
  if (!_0x2edac6.data?.success || !_0x2edac6.data?.id) {
    return null;
  }
  const _0x49fda7 = _0x2edac6.data.id;
  console.log("[ytautodl] loader.to job: " + _0x49fda7 + " (" + _0x130929 + ")");
  for (let _0x3ee433 = 0; _0x3ee433 < 30; _0x3ee433++) {
    await new Promise(_0x2e6bec => setTimeout(_0x2e6bec, 3000));
    const _0x137207 = await axios.get("https://loader.to/ajax/progress.php", {
      params: {
        id: _0x49fda7
      },
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://loader.to/"
      },
      timeout: 15000,
      validateStatus: () => true
    });
    const _0x383167 = _0x137207.data;
    console.log("[ytautodl] progress: " + (_0x383167?.progress || 0) + "/1000");
    if (_0x383167?.success === 1 && _0x383167?.download_url) {
      return _0x383167.download_url;
    }
    if (_0x383167?.progress === 1000 && _0x383167?.download_url) {
      return _0x383167.download_url;
    }
  }
  return null;
}
module.exports = {
  config: {
    credits: "MR DEVIL",
    name: "ytautodl",
    eventType: "message",
    description: "YouTube link auto detect karke video download aur send karo."
  },
  async run({
    api: _0x21512d,
    event: _0x59f664
  }) {
    const {
      threadID: _0x450d25,
      messageID: _0x16b0eb,
      body: _0x3d3d1c,
      senderID: _0x214780
    } = _0x59f664;
    if (!_0x3d3d1c) {
      return;
    }
    const _0x318a4e = _0x21512d.getCurrentUserID();
    if (_0x214780 === _0x318a4e) {
      return;
    }
    if (!_0x3d3d1c.includes("youtube.com") && !_0x3d3d1c.includes("youtu.be")) {
      return;
    }
    const _0x19d49b = extractYtUrl(_0x3d3d1c);
    if (!_0x19d49b) {
      return;
    }
    console.log("[ytautodl] Detected: " + _0x19d49b);
    const _0x2f069c = await _0x21512d.sendMessage(frames[0], _0x450d25);
    const _0x2970f0 = _0x2f069c?.messageID;
    try {
      await _0x21512d.editMessage(frames[1], _0x2970f0, _0x450d25);
      let _0x3e37d7 = null;
      for (const _0x40f794 of ["720", "480", "360"]) {
        try {
          _0x3e37d7 = await getDownloadUrl(_0x19d49b, _0x40f794);
          if (_0x3e37d7) {
            console.log("[ytautodl] Got URL at " + _0x40f794 + "p");
            break;
          }
        } catch (_0x1f0ed1) {
          console.log("[ytautodl] " + _0x40f794 + "p error: " + _0x1f0ed1.message);
        }
      }
      if (!_0x3e37d7) {
        await _0x21512d.editMessage("❌ YouTube video download nahi ho saka. Link check karo ya thodi der baad try karo.", _0x2970f0, _0x450d25);
        return;
      }
      await _0x21512d.editMessage(frames[2], _0x2970f0, _0x450d25);
      fs.mkdirSync(cacheDir, {
        recursive: true
      });
      const _0x3f4e7d = path.join(cacheDir, "yt_" + Date.now() + ".mp4");
      await _0x21512d.editMessage(frames[3], _0x2970f0, _0x450d25);
      const _0x4b39e1 = await axios.get(_0x3e37d7, {
        responseType: "arraybuffer",
        timeout: 180000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Referer: "https://loader.to/"
        },
        maxRedirects: 10
      });
      if (!_0x4b39e1.data || _0x4b39e1.data.byteLength < 10000) {
        await _0x21512d.editMessage("❌ Video file empty aayi. Dobara try karo.", _0x2970f0, _0x450d25);
        return;
      }
      fs.writeFileSync(_0x3f4e7d, Buffer.from(_0x4b39e1.data));
      const _0x29b223 = (_0x4b39e1.data.byteLength / 1024 / 1024).toFixed(2);
      console.log("[ytautodl] Saved: " + _0x29b223 + " MB");
      await _0x21512d.editMessage(frames[4], _0x2970f0, _0x450d25);
      await _0x21512d.editMessage(frames[5], _0x2970f0, _0x450d25);
      _0x21512d.setMessageReaction("✅", _0x16b0eb, () => {}, true);
      const _0x172c3b = "🎬 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 𝐕𝐢𝐝𝐞𝐨\n━━━━━━━━━━━━━━━━━━━━\n" + ("🔗 𝐋𝐢𝐧𝐤  : " + _0x19d49b.slice(0, 50) + (_0x19d49b.length > 50 ? "..." : "") + "\n") + ("📦 𝐒𝐢𝐳𝐞  : " + _0x29b223 + " MB\n") + "━━━━━━━━━━━━━━━━━━━━\n✅ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐌𝐑 𝐃𝐄𝐕𝐈𝐋 𝐁𝐎𝐓";
      _0x21512d.sendMessage({
        body: _0x172c3b,
        attachment: fs.createReadStream(_0x3f4e7d)
      }, _0x450d25, () => {
        try {
          fs.unlinkSync(_0x3f4e7d);
        } catch {}
        try {
          _0x21512d.unsendMessage(_0x2970f0);
        } catch {}
      }, _0x16b0eb);
    } catch (_0x1a6dc2) {
      console.error("[ytautodl] Error:", _0x1a6dc2.message);
      try {
        await _0x21512d.editMessage("❌ Error: " + _0x1a6dc2.message, _0x2970f0, _0x450d25);
      } catch {}
      _0x21512d.setMessageReaction("❌", _0x16b0eb, () => {}, true);
    }
  }
};