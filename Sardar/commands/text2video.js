const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cacheDir = path.join(__dirname, "..", "cache", "text2video");
const frames = ["🎬 Video generate ho rahi hai...\n\n⌛▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒  10%", "🤖 AI prompt process kar raha hai...\n\n⌛▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒  30%", "🎞️ Scenes bana raha hai...\n\n⏳▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒  50%", "📥 Video render ho rahi hai...\n\n⏳▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒  70%", "📦 File ready ho rahi hai...\n\n⏳▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒  90%", "✅ Complete!\n\n🟢▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100% 😍"];
module.exports = {
  config: {
    credits: "MR DEVIL",
    name: "text2video",
    aliases: ["t2v", "makevideo", "vidgen"],
    description: "Text se AI video generate karo.",
    usage: "text2video [prompt]",
    category: "AI",
    prefix: true,
    adminOnly: false,
    cooldowns: 30
  },
  async run({
    api: _0x328c94,
    event: _0x5b026f,
    args: _0xf1d296,
    send: _0x1ca3f5
  }) {
    const {
      threadID: _0x5bb207,
      messageID: _0x125f74
    } = _0x5b026f;
    if (!_0xf1d296.length) {
      return _0x1ca3f5.reply("╭──── 🎬 TEXT2VIDEO ────╮\n│\n│  Text se AI video\n│  generate karta hai!\n│\n│  📌 Usage:\n│  .text2video cat playing\n│              football\n│\n│  💡 Tips:\n│  • English prompt dalo\n│  • Short & clear likho\n│\n╰────────────────────╯");
    }
    const _0xe26618 = _0xf1d296.join(" ");
    const _0xc5b569 = await _0x328c94.sendMessage(frames[0], _0x5bb207);
    const _0x211c7e = _0xc5b569?.messageID;
    try {
      await _0x328c94.editMessage(frames[1], _0x211c7e, _0x5bb207);
      const _0x1b2030 = await axios.get("https://anabot.my.id/api/ai/text2video", {
        params: {
          prompt: _0xe26618,
          apikey: "freeApikey"
        },
        headers: {
          accept: "application/json"
        },
        timeout: 120000,
        validateStatus: () => true
      });
      if (_0x1b2030.status !== 200 || !_0x1b2030.data?.success || !_0x1b2030.data?.data?.result) {
        try {
          _0x328c94.unsendMessage(_0x211c7e);
        } catch {}
        return _0x1ca3f5.reply("❌ Video generate nahi ho saki. Thoda aur wait karke dobara try karo.");
      }
      const _0x181d98 = _0x1b2030.data.data.result;
      console.log("[text2video] URL: " + _0x181d98);
      await _0x328c94.editMessage(frames[2], _0x211c7e, _0x5bb207);
      fs.mkdirSync(cacheDir, {
        recursive: true
      });
      const _0x3ca21b = path.join(cacheDir, "t2v_" + Date.now() + ".mp4");
      await _0x328c94.editMessage(frames[3], _0x211c7e, _0x5bb207);
      const _0x3e08b3 = await axios.get(_0x181d98, {
        responseType: "arraybuffer",
        timeout: 120000,
        headers: {
          "User-Agent": "Mozilla/5.0"
        },
        maxRedirects: 5
      });
      if (!_0x3e08b3.data || _0x3e08b3.data.byteLength < 1000) {
        try {
          _0x328c94.unsendMessage(_0x211c7e);
        } catch {}
        return _0x1ca3f5.reply("❌ Video file empty aayi. Dobara try karo.");
      }
      const _0x258272 = (_0x3e08b3.data.byteLength / 1024 / 1024).toFixed(2);
      fs.writeFileSync(_0x3ca21b, Buffer.from(_0x3e08b3.data));
      console.log("[text2video] Saved: " + _0x258272 + " MB");
      await _0x328c94.editMessage(frames[4], _0x211c7e, _0x5bb207);
      await _0x328c94.editMessage(frames[5], _0x211c7e, _0x5bb207);
      _0x328c94.setMessageReaction("✅", _0x125f74, () => {}, true);
      _0x328c94.sendMessage({
        body: "🎬 𝐀𝐈 𝐕𝐢𝐝𝐞𝐨 𝐑𝐞𝐚𝐝𝐲!\n━━━━━━━━━━━━━━━━━━━━\n" + ("📝 𝐏𝐫𝐨𝐦𝐩𝐭 : " + _0xe26618.slice(0, 60) + (_0xe26618.length > 60 ? "..." : "") + "\n") + ("📦 𝐒𝐢𝐳𝐞   : " + _0x258272 + " MB\n") + "🤖 𝐀𝐈     : Gemini Powered\n━━━━━━━━━━━━━━━━━━━━\n✅ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐌𝐑 𝐃𝐄𝐕𝐈𝐋 𝐁𝐎𝐓",
        attachment: fs.createReadStream(_0x3ca21b)
      }, _0x5bb207, () => {
        try {
          fs.unlinkSync(_0x3ca21b);
        } catch {}
        try {
          _0x328c94.unsendMessage(_0x211c7e);
        } catch {}
      }, _0x125f74);
    } catch (_0x55f71f) {
      console.error("[text2video] Error:", _0x55f71f.message);
      try {
        _0x328c94.editMessage("❌ Error: " + _0x55f71f.message, _0x211c7e, _0x5bb207);
      } catch {}
      _0x328c94.setMessageReaction("❌", _0x125f74, () => {}, true);
    }
  }
};