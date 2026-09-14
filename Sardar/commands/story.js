const axios = require('axios');

module.exports = {
  config: {
    credits: "MR DEVIL",
    name: 'story',
    aliases: ['tale'],
    description: 'AI se short, funny ya adventurous story banwao — optional topic do.',
    usage: 'story [topic]',
    category: 'Fun',
    prefix: true,
    cooldowns: 10
  },
  async run({ args, send }) {
    const topic = args.join(' ').trim();

    await send(topic ? `📖 "${topic}" pe kahani likh raha hoon, ruko...` : `📖 Random kahani likh raha hoon, ruko...`);

    const prompt = topic
      ? `Write a short, fun, family-friendly story (max 120 words) about: ${topic}. Keep it light, creative, and safe for all audiences. No violence, no scary/disturbing content.`
      : `Write a short, fun, family-friendly random story (max 120 words) with an unexpected twist ending. Keep it light, creative, and safe for all audiences.`;

    try {
      const res = await axios.post('https://text.pollinations.ai/openai', {
        model: 'openai',
        messages: [{ role: 'user', content: prompt }],
        seed: Math.floor(Math.random() * 9999)
      }, { timeout: 15000, headers: { 'Content-Type': 'application/json' } });

      const story = res.data?.choices?.[0]?.message?.content?.trim();
      if (story) {
        return send(`📖 𝐒𝐓𝐎𝐑𝐘 𝐓𝐈𝐌𝐄\n━━━━━━━━━━━━━━━━━━━━\n${story}`);
      }
    } catch (e) {}

    send(`😅 Abhi story generate nahi ho saki, thodi der baad try karo.`);
  }
};
