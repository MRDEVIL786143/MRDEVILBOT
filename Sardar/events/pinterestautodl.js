const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const cacheDir = path.join(__dirname, '..', 'cache', 'pinterest');

const frames = [
  '📌 Pinterest link detect hua!\n\n⌛▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 10%',
  '🔍 Media info fetch ho rahi hai...\n\n⌛▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒ 30%',
  '⬇️ Downloading...\n\n⏳▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒ 60%',
  '📦 File ready ho rahi hai...\n\n⏳▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒ 85%',
  '✅ Complete!\n\n🟢▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100% 😍'
];

function extractPinterestUrl(text) {
  const match = text.match(/https?:\/\/(www\.)?(pinterest\.(com|ca|co\.uk|fr|de|es|it|pt|ru|jp|au|at|be|br|ch|cl|co|dk|fi|hu|id|in|mx|nz|ph|pl|se|sk|th|tw|vn)|pin\.it)\/[^\s]*/i);
  if (!match) return null;
  return match[0].split(' ')[0];
}

async function downloadFile(url, dest) {
  try {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.pinterest.com/'
      },
      maxRedirects: 10
    });
    if (res.data && res.data.byteLength > 1000) {
      fs.writeFileSync(dest, Buffer.from(res.data));
      return res.data.byteLength;
    }
    return 0;
  } catch (e) {
    console.log('[pinterestautodl] Download failed:', e.message);
    return 0;
  }
}

async function fetchPinterest(url) {
  // Try anabot API
  try {
    const res = await axios.get('https://anabot.my.id/api/dl/pinterest', {
      params: { url, apikey: 'freeApikey' },
      headers: { accept: 'application/json' },
      timeout: 15000,
      validateStatus: () => true
    });
    if (res.status === 200 && res.data?.success && res.data?.data) {
      const d = res.data.data;
      return {
        mediaUrl: d.video_url || d.url || d.image_url || null,
        thumb: d.thumbnail || d.image_url || null,
        title: d.title || 'Pinterest Media',
        type: d.video_url ? 'video' : 'image'
      };
    }
  } catch (e) {}

  // Try pinterestdownloader API fallback
  try {
    const res = await axios.post('https://www.savepin.app/download.php', 
      `url=${encodeURIComponent(url)}&lang=en&button=download`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://www.savepin.app/'
        },
        timeout: 12000,
        validateStatus: () => true
      }
    );
    if (res.status === 200 && res.data) {
      // Parse direct media links from HTML
      const videoMatch = res.data.match(/href="(https:\/\/[^"]+\.mp4[^"]*)"/i);
      const imgMatch = res.data.match(/href="(https:\/\/[^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
      const mediaUrl = videoMatch?.[1] || imgMatch?.[1] || null;
      if (mediaUrl) {
        return {
          mediaUrl,
          title: 'Pinterest Media',
          type: videoMatch ? 'video' : 'image'
        };
      }
    }
  } catch (e) {}

  return null;
}

module.exports = {
  config: {
    credits: 'MR DEVIL',
    name: 'pinterestautodl',
    eventType: 'message',
    description: 'Pinterest video/image auto detect karke download aur send karo.'
  },
  async run({ api, event }) {
    const { threadID, messageID, body, senderID } = event;
    if (!body) return;
    const botID = api.getCurrentUserID();
    if (senderID === botID) return;
    if (!body.includes('pinterest.com') && !body.includes('pin.it')) return;

    const url = extractPinterestUrl(body);
    if (!url) return;

    console.log('[pinterestautodl] URL:', url);
    const sentMsg = await api.sendMessage(frames[0], threadID);
    const msgID = sentMsg?.messageID;

    try {
      await api.editMessage(frames[1], msgID, threadID);
      const data = await fetchPinterest(url);

      if (!data || !data.mediaUrl) {
        await api.editMessage('❌ Pinterest media download nahi ho saki. Link check karo.', msgID, threadID);
        api.setMessageReaction('❌', messageID, () => {}, true);
        return;
      }

      await api.editMessage(frames[2], msgID, threadID);
      fs.mkdirSync(cacheDir, { recursive: true });

      const ext = data.type === 'video' ? 'mp4' : 'jpg';
      const filePath = path.join(cacheDir, `pinterest_${Date.now()}.${ext}`);

      await api.editMessage(frames[3], msgID, threadID);
      const size = await downloadFile(data.mediaUrl, filePath);

      if (!size) {
        await api.editMessage('❌ File save nahi ho saki.', msgID, threadID);
        api.setMessageReaction('❌', messageID, () => {}, true);
        return;
      }

      await api.editMessage(frames[4], msgID, threadID);
      api.setMessageReaction('✅', messageID, () => {}, true);

      const sizeMB = (size / 1024 / 1024).toFixed(2);
      const caption =
        `📌 𝐏𝐈𝐍𝐓𝐄𝐑𝐄𝐒𝐓 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📝 𝐓𝐢𝐭𝐥𝐞: ${data.title}\n` +
        `📁 𝐓𝐲𝐩𝐞: ${data.type === 'video' ? '🎬 Video' : '🖼️ Image'}\n` +
        `💾 𝐒𝐢𝐳𝐞: ${sizeMB} MB\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `🤖 𝐁𝐲: MR DEVIL BOT`;

      api.sendMessage(
        { body: caption, attachment: fs.createReadStream(filePath) },
        threadID,
        () => {
          try { fs.unlinkSync(filePath); } catch {}
          try { api.unsendMessage(msgID); } catch {}
        },
        messageID
      );
    } catch (err) {
      console.error('[pinterestautodl] Error:', err.message);
      try { await api.editMessage('❌ Error: ' + err.message, msgID, threadID); } catch {}
      api.setMessageReaction('❌', messageID, () => {}, true);
    }
  }
};
