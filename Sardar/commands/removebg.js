const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cacheDir = path.join(__dirname, "..", "cache", "removebg");
module.exports = {
  config: {
    credits: "MR DEVIL",
    name: "removebg",
    aliases: ["rmbg", "nobg", "bgremove"],
    description: "Kisi bhi photo ka background hata do.",
    usage: "removebg (image attach karo ya reply karo)",
    category: "Media",
    prefix: true,
    adminOnly: false,
    cooldowns: 10
  },
  async run({
    api: _0x379b51,
    event: _0x5807d0,
    send: _0x117b43
  }) {
    const {
      threadID: _0x5f411d,
      messageID: _0x57c89b,
      messageReply: _0x17b3ac
    } = _0x5807d0;
    let _0x48ad56 = null;
    const _0x575039 = _0x3b5e06 => {
      if (!_0x3b5e06?.length) {
        return null;
      }
      for (const _0x48d5f2 of _0x3b5e06) {
        if (_0x48d5f2.type === "photo" || _0x48d5f2.type === "sticker") {
          return _0x48d5f2.url || _0x48d5f2.previewUrl || _0x48d5f2.previewUrlFallback || null;
        }
      }
      return null;
    };
    _0x48ad56 = _0x575039(_0x5807d0.attachments);
    if (!_0x48ad56 && _0x17b3ac) {
      _0x48ad56 = _0x575039(_0x17b3ac.attachments);
    }
    if (!_0x48ad56) {
      return _0x117b43.reply("╭──── 🖼️ REMOVE BG ────╮\n│\n│  Photo ka background\n│  hata deta hai!\n│\n│  📌 Kaise use karein:\n│  1. Kisi photo pe reply\n│     karke .removebg likho\n│  2. Ya photo ke saath\n│     .removebg bhejo\n│\n╰────────────────────╯");
    }
    const _0x33cebe = await _0x379b51.sendMessage("🔄 Background hata raha hun...\n⏳ Thoda wait karo...", _0x5f411d);
    const _0x1d6814 = _0x33cebe?.messageID;
    try {
      const _0x310376 = await axios.get("https://anabot.my.id/api/ai/removebg", {
        params: {
          imageUrl: _0x48ad56,
          apikey: "freeApikey"
        },
        headers: {
          accept: "application/json"
        },
        timeout: 60000,
        validateStatus: () => true
      });
      if (_0x310376.status !== 200 || !_0x310376.data?.success || !_0x310376.data?.data?.result) {
        try {
          _0x379b51.unsendMessage(_0x1d6814);
        } catch {}
        return _0x117b43.reply("❌ Background nahi hata saka. Koi aur photo try karo.");
      }
      const _0x343cec = _0x310376.data.data.result;
      console.log("[removebg] Result: " + _0x343cec);
      fs.mkdirSync(cacheDir, {
        recursive: true
      });
      const _0x5ba6b5 = path.join(cacheDir, "rmbg_" + Date.now() + ".png");
      const _0x16a6d5 = await axios.get(_0x343cec, {
        responseType: "arraybuffer",
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0"
        },
        maxRedirects: 5
      });
      if (!_0x16a6d5.data || _0x16a6d5.data.byteLength < 100) {
        try {
          _0x379b51.unsendMessage(_0x1d6814);
        } catch {}
        return _0x117b43.reply("❌ Result image empty aayi. Dobara try karo.");
      }
      fs.writeFileSync(_0x5ba6b5, Buffer.from(_0x16a6d5.data));
      try {
        _0x379b51.unsendMessage(_0x1d6814);
      } catch {}
      _0x379b51.sendMessage({
        body: "✅ 𝐁𝐚𝐜𝐤𝐠𝐫𝐨𝐮𝐧𝐝 𝐇𝐚𝐭𝐚 𝐃𝐢𝐲𝐚!\n━━━━━━━━━━━━━━━━━━━━\n🖼️ Format : PNG (Transparent)\n🤖 AI     : Gemini Powered\n━━━━━━━━━━━━━━━━━━━━\n✅ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐌𝐑 𝐃𝐄𝐕𝐈𝐋 𝐁𝐎𝐓",
        attachment: fs.createReadStream(_0x5ba6b5)
      }, _0x5f411d, () => {
        try {
          fs.unlinkSync(_0x5ba6b5);
        } catch {}
      }, _0x57c89b);
    } catch (_0x2b8dfe) {
      console.error("[removebg] Error:", _0x2b8dfe.message);
      try {
        _0x379b51.unsendMessage(_0x1d6814);
      } catch {}
      _0x117b43.reply("❌ Error: " + _0x2b8dfe.message);
    }
  }
};