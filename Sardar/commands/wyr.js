const axios = require('axios');

const FALLBACK_QUESTIONS = [
  "Hamesha 1 ghante late hona ya hamesha 1 ghanta jaldi pohanchna?",
  "Sirf text kar sakna ya sirf call kar sakna, baki zindagi?",
  "Internet ke bina jeena ya AC ke bina jeena?",
  "Har waqt loud singing sunte rehna ya har waqt mosquito buzzing sunte rehna?",
  "Time travel kar sakna par sirf past mein, ya sirf future mein?",
  "Cheezein hamesha 10 minute late milein ya hamesha 10 minute jaldi expire ho jayein?",
  "Mind-reading power ya invisibility power?",
  "Hamesha bohat garam khana khana ya hamesha bilkul thanda khana khana?"
];

module.exports = {
  config: {
    credits: "MR DEVIL",
    name: 'wyr',
    aliases: ['wouldyourather'],
    description: 'AI-generated "Would You Rather" sawal — group mein mazay ki behas shuru karo!',
    usage: 'wyr',
    category: 'Fun',
    prefix: true,
    cooldowns: 8
  },
  async run({ send }) {
    try {
      const prompt =
        `Generate ONE creative, funny, family-friendly "Would you rather...?" question. ` +
        `Keep both options light-hearted, silly, and safe for a general audience group chat. ` +
        `No violence, no gross/disturbing content, no sexual content. ` +
        `Format EXACTLY as: "Option A... or Option B?" — respond with ONLY the question, nothing else.`;

      const res = await axios.post('https://text.pollinations.ai/openai', {
        model: 'openai',
        messages: [{ role: 'user', content: prompt }],
        seed: Math.floor(Math.random() * 9999)
      }, { timeout: 10000, headers: { 'Content-Type': 'application/json' } });

      const question = res.data?.choices?.[0]?.message?.content?.trim();
      if (question) {
        return send(`🤔 𝐖𝐎𝐔𝐋𝐃 𝐘𝐎𝐔 𝐑𝐀𝐓𝐇𝐄𝐑...\n━━━━━━━━━━━━━━━━━━━━\n${question}\n\n💬 Comment mein apna jawab do!`);
      }
    } catch (e) {}

    const fallback = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
    send(`🤔 𝐖𝐎𝐔𝐋𝐃 𝐘𝐎𝐔 𝐑𝐀𝐓𝐇𝐄𝐑...\n━━━━━━━━━━━━━━━━━━━━\n${fallback}\n\n💬 Comment mein apna jawab do!`);
  }
};
