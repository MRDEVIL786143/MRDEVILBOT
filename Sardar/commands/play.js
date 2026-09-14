const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cacheDir = path.join(__dirname, "cache", "audio");
module.exports = {
  config: {
    credits: "MR DEVIL",
    name: "play",
    aliases: ["music", "song", "gaana", "playmusic"],
    description: "Song ka naam likh kar music download karo.",
    usage: "play [song name]",
    category: "Media",
    prefix: true,
    cooldowns: 15
  },
  async run({
    api: _0x301d27,
    event: _0x20fec6,
    args: _0x565175,
    send: _0x24ba84
  }) {
    const {
      threadID: _0x112e73,
      messageID: _0x423864
    } = _0x20fec6;
    if (!_0x565175[0]) {
      return _0x24ba84.reply("❌ Song ka naam dena zaroori hai!\n\n📌 𝐔𝐬𝐚𝐠𝐞: .play [song name]\n📌 𝐄𝐱𝐚𝐦𝐩𝐥𝐞: .play Tere Bina");
    }
    const _0x14e9b0 = _0x565175.join(" ").trim();
    _0x24ba84.reply("🎵 \"" + _0x14e9b0 + "\" dhoondh raha hun, zara ruko...");
    try {
      const _0x54f9ce = await axios.get("https://anabot.my.id/api/download/playmusic", {
        params: {
          query: _0x14e9b0,
          apikey: "freeApikey"
        },
        headers: {
          accept: "application/json"
        },
        timeout: 60000
      });
      const _0x17cfcc = _0x54f9ce.data?.data?.result;
      if (!_0x17cfcc?.success || !_0x17cfcc?.urls) {
        return _0x24ba84.reply("❌ \"" + _0x14e9b0 + "\" nahi mili. Doosra naam try karo.");
      }
      const _0x127df8 = _0x17cfcc.metadata || {};
      const _0x31a888 = _0x127df8.title || "Unknown Title";
      const _0xd490ab = _0x127df8.duration ? Math.floor(_0x127df8.duration / 60) + ":" + String(_0x127df8.duration % 60).padStart(2, "0") : "?";
      const _0x128fda = _0x127df8.channel || _0x127df8.uploader || "Unknown";
      const _0x31b9ba = _0x127df8.view_count ? Number(_0x127df8.view_count).toLocaleString() : "?";
      const _0x59fdc5 = _0x17cfcc.urls;
      fs.mkdirSync(cacheDir, {
        recursive: true
      });
      const _0xd161 = "play_" + Date.now() + ".mp3";
      const _0x18562d = path.join(cacheDir, _0xd161);
      const _0x4b44ce = await axios.get(_0x59fdc5, {
        responseType: "arraybuffer",
        timeout: 120000
      });
      fs.writeFileSync(_0x18562d, Buffer.from(_0x4b44ce.data));
      const _0x287ffc = "🎵 𝐌𝐮𝐬𝐢𝐜 𝐏𝐥𝐚𝐲𝐞𝐫\n━━━━━━━━━━━━━━━━━━━━\n" + ("📌 𝐓𝐢𝐭𝐥𝐞  : " + _0x31a888 + "\n") + ("🎙️ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥: " + _0x128fda + "\n") + ("⏱️ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: " + _0xd490ab + "\n") + ("👁️ 𝐕𝐢𝐞𝐰𝐬  : " + _0x31b9ba + "\n") + "━━━━━━━━━━━━━━━━━━━━\n✅ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐌𝐑 𝐃𝐄𝐕𝐈𝐋 𝐁𝐎𝐓";
      _0x301d27.sendMessage({
        body: _0x287ffc,
        attachment: fs.createReadStream(_0x18562d)
      }, _0x112e73, () => {
        try {
          fs.unlinkSync(_0x18562d);
        } catch {}
      }, _0x423864);
    } catch (_0x5c6f38) {
      console.error("[play]", _0x5c6f38.message);
      if (_0x5c6f38.code === "ECONNABORTED" || _0x5c6f38.message.includes("timeout")) {
        return _0x24ba84.reply("⏰ Request timeout ho gaya. Network slow hai, dobara try karo.");
      }
      _0x24ba84.reply("❌ Error aa gaya: " + _0x5c6f38.message);
    }
  }
};