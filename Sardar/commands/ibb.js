module.exports = {
  config: {
    credits: "MR DEVIL",
    name: "ibb",
    aliases: ["imgbb", "uploadimg"],
    description: "Upload images to ImgBB and get a shareable link.",
    usage: "ibb [reply to one or more images]",
    category: "Utility",
    prefix: true,
    cooldowns: 5
  },
  async run({
    api: _0x5bd61d,
    event: _0x1fed19
  }) {
    const _0x378240 = require("axios");
    const {
      threadID: _0x536d4f,
      messageID: _0x1af629
    } = _0x1fed19;
    if (!_0x1fed19.messageReply || !_0x1fed19.messageReply.attachments || _0x1fed19.messageReply.attachments.length === 0) {
      return _0x5bd61d.sendMessage("╭───「 🖼️ 𝗜𝗕𝗕 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗥 」───⟡\n│\n│  ❌ Kisi image ka reply karo!\n│\n│  📌 Usage:\n│     Pehle image bhejo, phir\n│     us pe .ibb reply karo\n│\n│  💡 Multiple images bhi\n│     upload ho sakti hain!\n│\n╰───────────────────────⟡", _0x536d4f, _0x1af629);
    }
    const _0x66a4b1 = "e17a15dd6af452cbe53747c0b2b0866d";
    const _0x213daa = "https://api.imgbb.com/1/upload";
    const _0x4b9ba6 = _0x1fed19.messageReply.attachments;
    const _0x46125f = _0x4b9ba6.length;
    const _0x3374a9 = ["╭───「 🖼️ 𝗜𝗕𝗕 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗥 」───⟡\n│\n│  ⏳ Upload ho raha hai...\n│\n│  ▱▱▱▱▱▱▱▱▱▱  0%\n│\n╰───────────────────────⟡", "╭───「 🖼️ 𝗜𝗕𝗕 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗥 」───⟡\n│\n│  ⏳ Upload ho raha hai...\n│\n│  ▰▰▱▱▱▱▱▱▱▱  20%\n│\n╰───────────────────────⟡", "╭───「 🖼️ 𝗜𝗕𝗕 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗥 」───⟡\n│\n│  ⏳ Upload ho raha hai...\n│\n│  ▰▰▰▰▱▱▱▱▱▱  40%\n│\n╰───────────────────────⟡", "╭───「 🖼️ 𝗜𝗕𝗕 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗥 」───⟡\n│\n│  ⏳ Upload ho raha hai...\n│\n│  ▰▰▰▰▰▰▱▱▱▱  60%\n│\n╰───────────────────────⟡", "╭───「 🖼️ 𝗜𝗕𝗕 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗥 」───⟡\n│\n│  ⏳ Upload ho raha hai...\n│\n│  ▰▰▰▰▰▰▰▰▱▱  80%\n│\n╰───────────────────────⟡", "╭───「 🖼️ 𝗜𝗕𝗕 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗥 」───⟡\n│\n│  ⏳ Almost done...\n│\n│  ▰▰▰▰▰▰▰▰▰▰  99%\n│\n╰───────────────────────⟡"];
    let _0x4732d0 = null;
    let _0x2b0c90 = 0;
    await new Promise(_0x3102a3 => _0x5bd61d.sendMessage(_0x3374a9[0], _0x536d4f, (_0x43a3e8, _0x55212e) => {
      if (!_0x43a3e8) {
        _0x4732d0 = _0x55212e.messageID;
      }
      _0x3102a3();
    }, _0x1af629));
    const _0x255746 = setInterval(() => {
      _0x2b0c90 = Math.min(_0x2b0c90 + 1, _0x3374a9.length - 2);
      if (_0x4732d0) {
        _0x5bd61d.editMessage(_0x3374a9[_0x2b0c90], _0x4732d0, () => {});
      }
    }, 1200);
    const _0x46ddfb = [];
    for (const _0x1e4051 of _0x4b9ba6) {
      if (!_0x1e4051.url) {
        _0x46ddfb.push({
          success: false,
          url: null
        });
        continue;
      }
      try {
        const _0x23acdc = await _0x378240.get(_0x1e4051.url, {
          responseType: "arraybuffer"
        });
        const _0x565693 = Buffer.from(_0x23acdc.data, "binary").toString("base64");
        const _0x1d9726 = new URLSearchParams();
        _0x1d9726.append("key", _0x66a4b1);
        _0x1d9726.append("image", _0x565693);
        const _0x4b4546 = await _0x378240.post(_0x213daa, _0x1d9726, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
        _0x46ddfb.push({
          success: true,
          url: _0x4b4546.data.data.url
        });
      } catch (_0x328559) {
        _0x46ddfb.push({
          success: false,
          url: null
        });
      }
    }
    clearInterval(_0x255746);
    if (_0x4732d0) {
      _0x5bd61d.editMessage(_0x3374a9[_0x3374a9.length - 1], _0x4732d0, () => {});
      await new Promise(_0x51a095 => setTimeout(_0x51a095, 600));
    }
    const _0x1639ec = _0x46ddfb.filter(_0xa1fc71 => _0xa1fc71.success).length;
    const _0x3b88e0 = _0x46ddfb.filter(_0x1e1adf => !_0x1e1adf.success).length;
    let _0x23630e = "";
    _0x46ddfb.forEach((_0x29121, _0x16d49e) => {
      if (_0x29121.success) {
        _0x23630e += "│  🔗 Image " + (_0x16d49e + 1) + ":\n│  " + _0x29121.url + "\n│\n";
      } else {
        _0x23630e += "│  ❌ Image " + (_0x16d49e + 1) + ": Upload fail!\n│\n";
      }
    });
    const _0xc8598d = "╭───「 🖼️ 𝗜𝗕𝗕 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗥 」───⟡\n│\n│  ✅ Upload Complete!\n" + ("│  📦 Total : " + _0x46125f + " image" + (_0x46125f > 1 ? "s" : "") + "\n") + ("│  ✔️  Done  : " + _0x1639ec + "   ❌ Failed: " + _0x3b88e0 + "\n") + "│\n│  ─────────────────────\n│\n" + _0x23630e + "│  🌐 Powered by ImgBB\n│  ⚙️ MR DEVIL BOT\n╰───────────────────────⟡";
    if (_0x4732d0) {
      _0x5bd61d.editMessage(_0xc8598d, _0x4732d0, () => {});
    } else {
      _0x5bd61d.sendMessage(_0xc8598d, _0x536d4f, _0x1af629);
    }
  }
};
