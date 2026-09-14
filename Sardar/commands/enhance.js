const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cacheDir = path.join(__dirname, "..", "cache", "enhance");
module.exports = {
  config: {
    credits: "MR DEVIL",
    name: "enhance",
    aliases: ["hd", "upscale", "improve"],
    description: "Photo ki quality enhance aur HD karo AI se.",
    usage: "enhance (image attach karo ya reply karo)",
    category: "Media",
    prefix: true,
    adminOnly: false,
    cooldowns: 10
  },
  async run({
    api: _0x29bb7d,
    event: _0x1e4ffb,
    send: _0x243535
  }) {
    const {
      threadID: _0x10dafa,
      messageID: _0x322b4d,
      messageReply: _0x4d01a5
    } = _0x1e4ffb;
    let _0x3b5826 = null;
    const _0x5d00bd = _0x22b8a1 => {
      if (!_0x22b8a1?.length) {
        return null;
      }
      for (const _0x516c07 of _0x22b8a1) {
        if (_0x516c07.type === "photo" || _0x516c07.type === "sticker") {
          return _0x516c07.url || _0x516c07.previewUrl || _0x516c07.previewUrlFallback || null;
        }
      }
      return null;
    };
    _0x3b5826 = _0x5d00bd(_0x1e4ffb.attachments);
    if (!_0x3b5826 && _0x4d01a5) {
      _0x3b5826 = _0x5d00bd(_0x4d01a5.attachments);
    }
    if (!_0x3b5826) {
      return _0x243535.reply("╭──── ✨ ENHANCE ────╮\n│\n│  Photo ko HD aur\n│  sharp bana deta hai!\n│\n│  📌 Kaise use karein:\n│  1. Kisi photo pe reply\n│     karke .enhance likho\n│  2. Ya photo ke saath\n│     .enhance bhejo\n│\n╰────────────────────╯");
    }
    const _0x3a5591 = await _0x29bb7d.sendMessage("✨ Photo enhance ho rahi hai...\n⏳ Thoda wait karo...", _0x10dafa);
    const _0x48c87c = _0x3a5591?.messageID;
    try {
      const _0xfc9dd4 = await axios.get("https://anabot.my.id/api/ai/toEnhance", {
        params: {
          imageUrl: _0x3b5826,
          apikey: "freeApikey"
        },
        headers: {
          accept: "application/json"
        },
        timeout: 60000,
        validateStatus: () => true
      });
      if (_0xfc9dd4.status !== 200 || !_0xfc9dd4.data?.success || !_0xfc9dd4.data?.data?.result) {
        try {
          _0x29bb7d.unsendMessage(_0x48c87c);
        } catch {}
        return _0x243535.reply("❌ Photo enhance nahi ho saki. Koi aur photo try karo.");
      }
      const _0x3b6276 = _0xfc9dd4.data.data.result;
      console.log("[enhance] Result: " + _0x3b6276);
      const _0x18175a = _0x3b6276.split(".").pop().split("?")[0] || "webp";
      fs.mkdirSync(cacheDir, {
        recursive: true
      });
      const _0x42aeba = path.join(cacheDir, "enhance_" + Date.now() + "." + _0x18175a);
      const _0x584ce7 = await axios.get(_0x3b6276, {
        responseType: "arraybuffer",
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0"
        },
        maxRedirects: 5
      });
      if (!_0x584ce7.data || _0x584ce7.data.byteLength < 100) {
        try {
          _0x29bb7d.unsendMessage(_0x48c87c);
        } catch {}
        return _0x243535.reply("❌ Enhanced image empty aayi. Dobara try karo.");
      }
      fs.writeFileSync(_0x42aeba, Buffer.from(_0x584ce7.data));
      try {
        _0x29bb7d.unsendMessage(_0x48c87c);
      } catch {}
      _0x29bb7d.sendMessage({
        body: "✨ 𝐏𝐡𝐨𝐭𝐨 𝐄𝐧𝐡𝐚𝐧𝐜𝐞𝐝!\n━━━━━━━━━━━━━━━━━━━━\n🖼️ Quality : HD Enhanced\n🤖 AI      : Gemini Powered\n━━━━━━━━━━━━━━━━━━━━\n✅ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐌𝐑 𝐃𝐄𝐕𝐈𝐋 𝐁𝐎𝐓",
        attachment: fs.createReadStream(_0x42aeba)
      }, _0x10dafa, () => {
        try {
          fs.unlinkSync(_0x42aeba);
        } catch {}
      }, _0x322b4d);
    } catch (_0x50ab18) {
      console.error("[enhance] Error:", _0x50ab18.message);
      try {
        _0x29bb7d.unsendMessage(_0x48c87c);
      } catch {}
      _0x243535.reply("❌ Error: " + _0x50ab18.message);
    }
  }
};