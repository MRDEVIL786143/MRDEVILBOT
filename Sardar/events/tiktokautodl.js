const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cacheDir = path.join(__dirname, "..", "cache", "tiktok");
const frames = ["🔍 TikTok link detect hua!\n\n⌛▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒  10%", "📡 Video info fetch ho rahi hai...\n\n⌛▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒  30%", "🎞️ No-watermark video select ho raha hai...\n\n⏳▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒  50%", "📥 Video download ho rahi hai...\n\n⏳▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒  70%", "📦 File ready ho rahi hai...\n\n⏳▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒  90%", "✅ Complete!\n\n🟢▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100% 😍"];
function extractTikTokUrl(_0x5753d0) {
  const _0x59d825 = _0x5753d0.match(/https?:\/\/(www\.|vt\.|vm\.|m\.)?tiktok\.com\/[^\s]*/i);
  if (!_0x59d825) {
    return null;
  }
  return _0x59d825[0].split(" ")[0];
}
async function downloadFile(_0x3a270f, _0x16c7de) {
  try {
    const _0x4882a5 = await axios.get(_0x3a270f, {
      responseType: "arraybuffer",
      timeout: 120000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "*/*",
        Referer: "https://www.tiktok.com/"
      },
      maxRedirects: 10
    });
    if (_0x4882a5.data && _0x4882a5.data.byteLength > 10000) {
      fs.writeFileSync(_0x16c7de, Buffer.from(_0x4882a5.data));
      return _0x4882a5.data.byteLength;
    }
    return 0;
  } catch (_0x12ec9f) {
    console.log("[tiktokautodl] Download failed: " + _0x12ec9f.message);
    return 0;
  }
}
module.exports = {
  config: {
    credits: "MR DEVIL",
    name: "tiktokautodl",
    eventType: "message",
    description: "TikTok link auto detect karke watermark-free video download aur send karo."
  },
  async run({
    api: _0x40dd88,
    event: _0x25a385
  }) {
    const {
      threadID: _0x490446,
      messageID: _0x575335,
      body: _0x3359e2,
      senderID: _0x399a7e
    } = _0x25a385;
    if (!_0x3359e2) {
      return;
    }
    const _0x303cc7 = _0x40dd88.getCurrentUserID();
    if (_0x399a7e === _0x303cc7) {
      return;
    }
    if (!_0x3359e2.includes("tiktok.com")) {
      return;
    }
    const _0x1b75e9 = extractTikTokUrl(_0x3359e2);
    if (!_0x1b75e9) {
      return;
    }
    console.log("[tiktokautodl] Detected: " + _0x1b75e9);
    const _0xbf90c5 = await _0x40dd88.sendMessage(frames[0], _0x490446);
    const _0x40ea26 = _0xbf90c5?.messageID;
    try {
      await _0x40dd88.editMessage(frames[1], _0x40ea26, _0x490446);
      const _0x202afe = await axios.get("https://anabot.my.id/api/download/tiktok", {
        params: {
          url: _0x1b75e9,
          apikey: "freeApikey"
        },
        headers: {
          accept: "application/json"
        },
        timeout: 30000,
        validateStatus: () => true
      });
      console.log("[tiktokautodl] API status: " + _0x202afe.status);
      if (_0x202afe.status !== 200 || !_0x202afe.data?.success) {
        await _0x40dd88.editMessage("❌ TikTok video fetch nahi ho saka. Link check karo ya thodi der baad try karo.", _0x40ea26, _0x490446);
        _0x40dd88.setMessageReaction("❌", _0x575335, () => {}, true);
        return;
      }
      const _0x4bf7d1 = _0x202afe.data?.data?.result;
      if (!_0x4bf7d1) {
        await _0x40dd88.editMessage("❌ Is TikTok link mein koi video nahi mili.", _0x40ea26, _0x490446);
        _0x40dd88.setMessageReaction("❌", _0x575335, () => {}, true);
        return;
      }
      const _0x1e498f = _0x4bf7d1.username || "Unknown";
      const _0x5a73fa = _0x4bf7d1.description || "";
      const _0x2d53ef = _0x4bf7d1.nowatermark;
      const _0x40542d = _0x4bf7d1.video;
      if (!_0x2d53ef && !_0x40542d) {
        await _0x40dd88.editMessage("❌ Video download link nahi mila. Video private ho sakti hai.", _0x40ea26, _0x490446);
        _0x40dd88.setMessageReaction("❌", _0x575335, () => {}, true);
        return;
      }
      await _0x40dd88.editMessage(frames[2], _0x40ea26, _0x490446);
      fs.mkdirSync(cacheDir, {
        recursive: true
      });
      const _0x200956 = path.join(cacheDir, "tiktok_" + Date.now() + ".mp4");
      await _0x40dd88.editMessage(frames[3], _0x40ea26, _0x490446);
      let _0x1d707a = 0;
      if (_0x2d53ef) {
        _0x1d707a = await downloadFile(_0x2d53ef, _0x200956);
      }
      if (!_0x1d707a && _0x40542d) {
        console.log("[tiktokautodl] Fallback to watermark video");
        _0x1d707a = await downloadFile(_0x40542d, _0x200956);
      }
      if (!_0x1d707a) {
        await _0x40dd88.editMessage("❌ Video file download nahi ho saki. Server ne block kar diya.", _0x40ea26, _0x490446);
        _0x40dd88.setMessageReaction("❌", _0x575335, () => {}, true);
        return;
      }
      const _0x4b4fe2 = (_0x1d707a / 1024 / 1024).toFixed(2);
      console.log("[tiktokautodl] Saved: " + _0x4b4fe2 + " MB");
      await _0x40dd88.editMessage(frames[4], _0x40ea26, _0x490446);
      await _0x40dd88.editMessage(frames[5], _0x40ea26, _0x490446);
      _0x40dd88.setMessageReaction("✅", _0x575335, () => {}, true);
      const _0x3fd154 = "🎵 𝐓𝐢𝐤𝐓𝐨𝐤 𝐕𝐢𝐝𝐞𝐨\n━━━━━━━━━━━━━━━━━━━━\n" + ("👤 𝐔𝐬𝐞𝐫    : " + _0x1e498f + "\n") + (_0x5a73fa ? "📝 𝐂𝐚𝐩𝐭𝐢𝐨𝐧 : " + _0x5a73fa.slice(0, 80) + (_0x5a73fa.length > 80 ? "..." : "") + "\n" : "") + ("📦 𝐒𝐢𝐳𝐞    : " + _0x4b4fe2 + " MB\n") + ("🚫 𝐖𝐚𝐭𝐞𝐫𝐦𝐚𝐫𝐤: " + (_0x2d53ef ? "Hata diya ✅" : "Watermark ke saath") + "\n") + "━━━━━━━━━━━━━━━━━━━━\n✅ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐌𝐑 𝐃𝐄𝐕𝐈𝐋 𝐁𝐎𝐓";
      _0x40dd88.sendMessage({
        body: _0x3fd154,
        attachment: fs.createReadStream(_0x200956)
      }, _0x490446, () => {
        try {
          fs.unlinkSync(_0x200956);
        } catch {}
        try {
          _0x40dd88.unsendMessage(_0x40ea26);
        } catch {}
      }, _0x575335);
    } catch (_0x23b59d) {
      console.error("[tiktokautodl] Error:", _0x23b59d.message);
      try {
        await _0x40dd88.editMessage("❌ Error: " + _0x23b59d.message, _0x40ea26, _0x490446);
      } catch {}
      _0x40dd88.setMessageReaction("❌", _0x575335, () => {}, true);
    }
  }
};