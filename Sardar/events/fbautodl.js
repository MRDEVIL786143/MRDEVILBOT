const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cacheDir = path.join(__dirname, "..", "cache", "facebook");
const frames = ["🔍 Facebook link detect hua!\n\n⌛▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒  10%", "📡 Video info fetch ho rahi hai...\n\n⌛▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒  30%", "🎞️ Best quality select ho rahi hai...\n\n⏳▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒  50%", "📥 Video download ho rahi hai...\n\n⏳▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒  70%", "📦 File ready ho raha hai...\n\n⏳▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒  90%", "✅ Complete!\n\n🟢▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100% 😍"];
function extractFbUrl(_0x9447dc) {
  const _0x3a7c37 = _0x9447dc.match(/https?:\/\/(www\.|m\.|web\.)?facebook\.com\/[^\s]+/i);
  if (!_0x3a7c37) {
    return null;
  }
  return _0x3a7c37[0].split("?")[0].replace(/\/$/, "");
}
function pickBestVideo(_0x593b09) {
  const _0x566699 = _0x593b09.filter(_0x5d2188 => _0x5d2188.type === "Video");
  if (!_0x566699.length) {
    return null;
  }
  const _0x441eda = _0x566699.filter(_0x4f8b45 => _0x4f8b45.mediaTask === "download");
  const _0x3cc353 = _0x441eda.length ? _0x441eda : _0x566699;
  for (const _0x14c984 of ["HD", "FHD", "SD"]) {
    const _0xb23572 = _0x3cc353.find(_0x3c14f4 => _0x3c14f4.mediaQuality === _0x14c984);
    if (_0xb23572) {
      return _0xb23572;
    }
  }
  return _0x3cc353[0];
}
async function downloadFile(_0x4b9c6f, _0x522028) {
  const _0x414775 = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.facebook.com/"
  };
  for (const _0x53ebaa of _0x4b9c6f) {
    try {
      console.log("[fbautodl] Trying: " + _0x53ebaa.slice(0, 80));
      const _0x2bbe3a = await axios.get(_0x53ebaa, {
        responseType: "arraybuffer",
        timeout: 120000,
        headers: _0x414775,
        maxRedirects: 5
      });
      if (_0x2bbe3a.data && _0x2bbe3a.data.byteLength > 10000) {
        fs.writeFileSync(_0x522028, Buffer.from(_0x2bbe3a.data));
        console.log("[fbautodl] Downloaded: " + (_0x2bbe3a.data.byteLength / 1024 / 1024).toFixed(2) + " MB");
        return true;
      }
    } catch (_0x387d5a) {
      console.log("[fbautodl] URL failed: " + _0x387d5a.message);
    }
  }
  return false;
}
module.exports = {
  config: {
    credits: "MR DEVIL",
    name: "fbautodl",
    eventType: "message",
    description: "Facebook video/reel link auto detect karke download aur send karo."
  },
  async run({
    api: _0x5bd2ae,
    event: _0x4f0c59
  }) {
    const {
      threadID: _0x3eeae4,
      messageID: _0x2ea95d,
      body: _0x3bec49,
      senderID: _0x42895f
    } = _0x4f0c59;
    if (!_0x3bec49) {
      return;
    }
    const _0x2bb1cb = _0x5bd2ae.getCurrentUserID();
    if (_0x42895f === _0x2bb1cb) {
      return;
    }
    if (!_0x3bec49.includes("facebook.com")) {
      return;
    }
    const _0x3ec947 = extractFbUrl(_0x3bec49);
    if (!_0x3ec947) {
      return;
    }
    console.log("[fbautodl] Detected: " + _0x3ec947);
    const _0x558a8c = await _0x5bd2ae.sendMessage(frames[0], _0x3eeae4);
    const _0x11cf72 = _0x558a8c?.messageID;
    try {
      await _0x5bd2ae.editMessage(frames[1], _0x11cf72, _0x3eeae4);
      const _0x1b3681 = await axios.get("https://anabot.my.id/api/download/facebook", {
        params: {
          url: _0x3ec947,
          apikey: "freeApikey"
        },
        headers: {
          accept: "application/json"
        },
        timeout: 30000,
        validateStatus: () => true
      });
      console.log("[fbautodl] API status: " + _0x1b3681.status);
      if (_0x1b3681.status !== 200 || !_0x1b3681.data?.success) {
        await _0x5bd2ae.editMessage("❌ Facebook video fetch nahi ho saka. Post private ho sakti hai.", _0x11cf72, _0x3eeae4);
        _0x5bd2ae.setMessageReaction("❌", _0x2ea95d, () => {}, true);
        return;
      }
      const _0x5c76d7 = _0x1b3681.data?.data?.result?.api;
      if (!_0x5c76d7?.mediaItems?.length) {
        await _0x5bd2ae.editMessage("❌ Is link mein koi video nahi mili.", _0x11cf72, _0x3eeae4);
        _0x5bd2ae.setMessageReaction("❌", _0x2ea95d, () => {}, true);
        return;
      }
      const _0x5a37fe = pickBestVideo(_0x5c76d7.mediaItems);
      if (!_0x5a37fe) {
        await _0x5bd2ae.editMessage("❌ Downloadable video nahi mili.", _0x11cf72, _0x3eeae4);
        _0x5bd2ae.setMessageReaction("❌", _0x2ea95d, () => {}, true);
        return;
      }
      await _0x5bd2ae.editMessage(frames[2], _0x11cf72, _0x3eeae4);
      const _0x4eb1f = _0x5c76d7.title || "Facebook Video";
      const _0x34950d = _0x5c76d7.description || "";
      const _0x3d8796 = _0x5c76d7.mediaStats?.likesCount || "?";
      const _0x236cc8 = _0x5c76d7.mediaStats?.commentsCount || "?";
      const _0x2222e0 = _0x5a37fe.mediaQuality || "?";
      const _0x331cd1 = _0x5a37fe.mediaRes || "?";
      const _0x558e0d = _0x5a37fe.mediaDuration || "?";
      const _0x41b494 = _0x5a37fe.mediaFileSize || "?";
      const _0x248cf0 = [];
      if (_0x5a37fe.mediaUrl) {
        _0x248cf0.push(_0x5a37fe.mediaUrl);
      }
      if (_0x5a37fe.mediaPreviewUrl) {
        _0x248cf0.push(_0x5a37fe.mediaPreviewUrl);
      }
      const _0x1a877a = _0x5c76d7.mediaItems.find(_0x42b332 => _0x42b332.type === "Video" && _0x42b332.mediaQuality === "SD" && _0x42b332.mediaTask === "download");
      if (_0x1a877a?.mediaUrl && _0x1a877a.mediaUrl !== _0x5a37fe.mediaUrl) {
        _0x248cf0.push(_0x1a877a.mediaUrl);
      }
      if (_0x1a877a?.mediaPreviewUrl) {
        _0x248cf0.push(_0x1a877a.mediaPreviewUrl);
      }
      await _0x5bd2ae.editMessage(frames[3], _0x11cf72, _0x3eeae4);
      fs.mkdirSync(cacheDir, {
        recursive: true
      });
      const _0x548fcc = path.join(cacheDir, "fb_" + Date.now() + ".mp4");
      const _0x537bc0 = await downloadFile(_0x248cf0, _0x548fcc);
      if (!_0x537bc0) {
        await _0x5bd2ae.editMessage("❌ Video file download nahi ho saka. Server ne block kar diya.", _0x11cf72, _0x3eeae4);
        _0x5bd2ae.setMessageReaction("❌", _0x2ea95d, () => {}, true);
        return;
      }
      await _0x5bd2ae.editMessage(frames[4], _0x11cf72, _0x3eeae4);
      await _0x5bd2ae.editMessage(frames[5], _0x11cf72, _0x3eeae4);
      _0x5bd2ae.setMessageReaction("✅", _0x2ea95d, () => {}, true);
      const _0x14149c = "🎬 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐕𝐢𝐝𝐞𝐨\n━━━━━━━━━━━━━━━━━━━━\n" + ("📌 𝐓𝐢𝐭𝐥𝐞  : " + _0x4eb1f + "\n") + (_0x34950d ? "📝 𝐃𝐞𝐬𝐜   : " + _0x34950d.slice(0, 80) + (_0x34950d.length > 80 ? "..." : "") + "\n" : "") + ("🎞️ 𝐐𝐮𝐚𝐥𝐢𝐭𝐲: " + _0x2222e0 + " (" + _0x331cd1 + ")\n") + ("⏱️ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: " + _0x558e0d + "\n") + ("📦 𝐒𝐢𝐳𝐞   : " + _0x41b494 + "\n") + ("❤️ 𝐋𝐢𝐤𝐞𝐬  : " + _0x3d8796 + " | 💬 " + _0x236cc8 + "\n") + "━━━━━━━━━━━━━━━━━━━━\n✅ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐌𝐑 𝐃𝐄𝐕𝐈𝐋 𝐁𝐎𝐓";
      _0x5bd2ae.sendMessage({
        body: _0x14149c,
        attachment: fs.createReadStream(_0x548fcc)
      }, _0x3eeae4, () => {
        try {
          fs.unlinkSync(_0x548fcc);
        } catch {}
        try {
          _0x5bd2ae.unsendMessage(_0x11cf72);
        } catch {}
      }, _0x2ea95d);
    } catch (_0x2c99dd) {
      console.error("[fbautodl] Error:", _0x2c99dd.message);
      try {
        await _0x5bd2ae.editMessage("❌ Error: " + _0x2c99dd.message, _0x11cf72, _0x3eeae4);
      } catch {}
      _0x5bd2ae.setMessageReaction("❌", _0x2ea95d, () => {}, true);
    }
  }
};