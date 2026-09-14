const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cacheDir = path.join(__dirname, "..", "cache", "instagram");
const frames = ["🔍 Instagram link detect hua!\n\n⌛▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒  10%", "📡 Media info fetch ho rahi hai...\n\n⌛▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒  30%", "📥 Media download ho raha hai...\n\n⏳▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒  55%", "📦 Files ready ho rahi hain...\n\n⏳▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒  85%", "✅ Complete!\n\n🟢▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100% 😍"];
function extractIgUrl(_0x3cef32) {
  const _0x2b5bb6 = _0x3cef32.match(/https?:\/\/(www\.)?instagram\.com\/(p|reel|tv|stories\/[^/\s?]+)\/([A-Za-z0-9_\-]+)/i);
  if (!_0x2b5bb6) {
    return null;
  }
  return "https://www.instagram.com/" + _0x2b5bb6[2] + "/" + _0x2b5bb6[3] + "/";
}
async function tryCobalt(_0xf03dd3) {
  const _0x29c4b7 = await axios.post("https://api.cobalt.tools/api/json", {
    url: _0xf03dd3,
    vQuality: "max",
    isNoTTWatermark: true
  }, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    timeout: 25000,
    validateStatus: () => true
  });
  if (_0x29c4b7.status !== 200) {
    return null;
  }
  const _0x4213f2 = _0x29c4b7.data;
  console.log("[igautodl] cobalt status: " + _0x4213f2?.status);
  if (_0x4213f2?.status === "stream" && _0x4213f2?.url) {
    return [{
      url: _0x4213f2.url,
      isVideo: true
    }];
  }
  if (_0x4213f2?.status === "picker" && Array.isArray(_0x4213f2?.picker)) {
    return _0x4213f2.picker.map(_0x3c3702 => ({
      url: _0x3c3702.url,
      isVideo: _0x3c3702.type === "video"
    }));
  }
  if (_0x4213f2?.status === "redirect" && _0x4213f2?.url) {
    return [{
      url: _0x4213f2.url,
      isVideo: true
    }];
  }
  return null;
}
async function tryAnabot(_0x31556d) {
  const _0x2d7269 = await axios.get("https://anabot.my.id/api/download/instagram", {
    params: {
      url: _0x31556d,
      apikey: "freeApikey"
    },
    headers: {
      accept: "application/json"
    },
    timeout: 20000,
    validateStatus: () => true
  });
  if (_0x2d7269.status !== 200 || !Array.isArray(_0x2d7269.data?.data?.result)) {
    return null;
  }
  return _0x2d7269.data.data.result.map(_0x87be8a => ({
    url: _0x87be8a.url || _0x87be8a.thumbnail
  }));
}
async function trySnapinsta(_0x128a7d) {
  const _0x2605e1 = await axios.post("https://snapsave.app/action.php", "url=" + encodeURIComponent(_0x128a7d), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0",
      Referer: "https://snapsave.app/"
    },
    timeout: 20000,
    validateStatus: () => true
  });
  if (_0x2605e1.status !== 200 || !_0x2605e1.data?.data) {
    return null;
  }
  const _0x2269ac = [];
  if (Array.isArray(_0x2605e1.data.data)) {
    _0x2605e1.data.data.forEach(_0x57587c => {
      if (_0x57587c?.url) {
        _0x2269ac.push({
          url: _0x57587c.url,
          isVideo: _0x57587c.type === "video" || _0x57587c.url.includes(".mp4")
        });
      }
    });
  }
  if (_0x2269ac.length) {
    return _0x2269ac;
  } else {
    return null;
  }
}
module.exports = {
  config: {
    credits: "MR DEVIL",
    name: "igautodl",
    eventType: "message",
    description: "Instagram link auto detect karke media download aur send karo."
  },
  async run({
    api: _0x47248d,
    event: _0x4479f5
  }) {
    const {
      threadID: _0x2469a8,
      messageID: _0x5e52b1,
      body: _0x1b3f3d,
      senderID: _0x468066
    } = _0x4479f5;
    if (!_0x1b3f3d) {
      return;
    }
    const _0x302e33 = _0x47248d.getCurrentUserID();
    if (_0x468066 === _0x302e33) {
      return;
    }
    if (!_0x1b3f3d.includes("instagram.com")) {
      return;
    }
    const _0x19a77b = extractIgUrl(_0x1b3f3d);
    if (!_0x19a77b) {
      return;
    }
    console.log("[igautodl] Detected: " + _0x19a77b);
    const _0x4bad6f = await _0x47248d.sendMessage(frames[0], _0x2469a8);
    const _0x3fd1d4 = _0x4bad6f?.messageID;
    try {
      await _0x47248d.editMessage(frames[1], _0x3fd1d4, _0x2469a8);
      let _0x42482f = null;
      try {
        _0x42482f = await tryCobalt(_0x19a77b);
      } catch (_0x2b3b92) {
        console.log("[igautodl] cobalt err: " + _0x2b3b92.message);
      }
      console.log("[igautodl] cobalt: " + (_0x42482f ? _0x42482f.length + " items" : "failed"));
      if (!_0x42482f) {
        try {
          _0x42482f = await tryAnabot(_0x19a77b);
        } catch (_0x5e4672) {
          console.log("[igautodl] anabot err: " + _0x5e4672.message);
        }
        console.log("[igautodl] anabot: " + (_0x42482f ? _0x42482f.length + " items" : "failed"));
      }
      if (!_0x42482f) {
        try {
          _0x42482f = await trySnapinsta(_0x19a77b);
        } catch (_0x1b5968) {
          console.log("[igautodl] snapinsta err: " + _0x1b5968.message);
        }
        console.log("[igautodl] snapinsta: " + (_0x42482f ? _0x42482f.length + " items" : "failed"));
      }
      if (!_0x42482f || _0x42482f.length === 0) {
        await _0x47248d.editMessage("❌ Instagram media download nahi ho saka. Post private ho sakti hai.", _0x3fd1d4, _0x2469a8);
        _0x47248d.setMessageReaction("❌", _0x5e52b1, () => {}, true);
        return;
      }
      await _0x47248d.editMessage(frames[2], _0x3fd1d4, _0x2469a8);
      fs.mkdirSync(cacheDir, {
        recursive: true
      });
      const _0x17ab9d = [];
      for (let _0x10b6af = 0; _0x10b6af < Math.min(_0x42482f.length, 10); _0x10b6af++) {
        const _0x1dbcf7 = _0x42482f[_0x10b6af];
        if (!_0x1dbcf7?.url) {
          continue;
        }
        const _0x3f7e6f = _0x1dbcf7.isVideo || _0x1dbcf7.url.includes(".mp4");
        const _0x3e3309 = _0x3f7e6f ? "mp4" : "jpg";
        const _0x20b328 = path.join(cacheDir, "ig_" + Date.now() + "_" + _0x10b6af + "." + _0x3e3309);
        try {
          const _0x3f4aad = await axios.get(_0x1dbcf7.url, {
            responseType: "arraybuffer",
            timeout: 90000,
            headers: {
              "User-Agent": "Mozilla/5.0",
              Referer: "https://www.instagram.com/"
            }
          });
          if (_0x3f4aad.data?.byteLength > 1000) {
            fs.writeFileSync(_0x20b328, Buffer.from(_0x3f4aad.data));
            _0x17ab9d.push(_0x20b328);
            console.log("[igautodl] saved " + _0x10b6af + ": " + (_0x3f4aad.data.byteLength / 1024).toFixed(0) + " KB");
          }
        } catch (_0x588033) {
          console.log("[igautodl] file " + _0x10b6af + " fail: " + _0x588033.message);
        }
      }
      if (_0x17ab9d.length === 0) {
        await _0x47248d.editMessage("❌ Media file save nahi ho saki.", _0x3fd1d4, _0x2469a8);
        _0x47248d.setMessageReaction("❌", _0x5e52b1, () => {}, true);
        return;
      }
      await _0x47248d.editMessage(frames[3], _0x3fd1d4, _0x2469a8);
      await _0x47248d.editMessage(frames[4], _0x3fd1d4, _0x2469a8);
      _0x47248d.setMessageReaction("✅", _0x5e52b1, () => {}, true);
      const _0x5ec9a1 = "📸 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐌𝐞𝐝𝐢𝐚\n━━━━━━━━━━━━━━━━━━━━\n" + ("🖼️ 𝐅𝐢𝐥𝐞𝐬 : " + _0x17ab9d.length + "\n") + "━━━━━━━━━━━━━━━━━━━━\n✅ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 �� ����� 𝐁𝐎𝐓";
      _0x47248d.sendMessage({
        body: _0x5ec9a1,
        attachment: _0x17ab9d.map(_0x2654b5 => fs.createReadStream(_0x2654b5))
      }, _0x2469a8, () => {
        _0x17ab9d.forEach(_0x12de94 => {
          try {
            fs.unlinkSync(_0x12de94);
          } catch {}
        });
        try {
          _0x47248d.unsendMessage(_0x3fd1d4);
        } catch {}
      }, _0x5e52b1);
    } catch (_0x288732) {
      console.error("[igautodl] Error:", _0x288732.message);
      try {
        await _0x47248d.editMessage("❌ Error: " + _0x288732.message, _0x3fd1d4, _0x2469a8);
      } catch {}
      _0x47248d.setMessageReaction("❌", _0x5e52b1, () => {}, true);
    }
  }
};