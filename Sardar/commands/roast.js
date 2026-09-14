const axios = require('axios');

module.exports = {
  config: {
    credits: "MR DEVIL",
    name: 'roast',
    aliases: ['roastme'],
    description: 'AI se apna ya kisi friend ka mazedaar (halka-phulka) roast karwao.',
    usage: 'roast [@mention | nothing for self]',
    category: 'Fun',
    prefix: true,
    cooldowns: 8
  },
  async run({ api, event, args, send, Users }) {
    const { senderID, mentions } = event;
    const targetID = Object.keys(mentions || {})[0] || senderID;
    const name = await Users.getNameUser(targetID).catch(() => args.join(' ') || 'Friend');

    await send(`🔥 ${name} ko roast kar rahe hain, ruko...`);

    const prompt =
      `Generate ONE short, funny, LIGHT-HEARTED roast (max 2 sentences) about a person named "${name}" ` +
      `for a friendly group chat. Keep it playful and silly — NOT mean, NOT about appearance/race/religion/disability, ` +
      `NOT genuinely insulting. Think "friendly banter between buddies", like jokes about being slow to reply, ` +
      `always broke, sleeps too much, eats too much, bad at games, etc. Respond with ONLY the roast text, nothing else. ` +
      `Mix in light Roman Urdu/Hinglish flavor since the audience is Pakistani.`;

    try {
      const res = await axios.post('https://text.pollinations.ai/openai', {
        model: 'openai',
        messages: [{ role: 'user', content: prompt }],
        seed: Math.floor(Math.random() * 9999)
      }, { timeout: 10000, headers: { 'Content-Type': 'application/json' } });

      const roast = res.data?.choices?.[0]?.message?.content?.trim();
      if (roast) {
        return send(`🔥 𝐑𝐎𝐀𝐒𝐓 𝐓𝐈𝐌𝐄!\n━━━━━━━━━━━━━━━━━━━━\n${roast}`);
      }
    } catch (e) {}

    // fallback static roasts if AI fails
    const fallbacks = [
      `${name} itna slow reply karta hai ke WiFi bhi sharminda ho jaye 😂`,
      `${name} ki battery se zyada uska mood drain hota hai 🔋😭`,
      `${name} ka bank balance dekh kar calculator bhi "0" bol deta hai 💸`,
      `${name} itna so leta hai ke alarm clock ne resign de diya 😴`
    ];
    send(`🔥 𝐑𝐎𝐀𝐒𝐓 𝐓𝐈𝐌𝐄!\n━━━━━━━━━━━━━━━━━━━━\n${fallbacks[Math.floor(Math.random() * fallbacks.length)]}`);
  }
};
