const QUESTIONS = [
  { q: "Pakistan ka sabse bara shehar konsa hai?", options: ["Lahore", "Karachi", "Islamabad", "Peshawar"], answer: 1 },
  { q: "Duniya ka sabse lamba darya konsa hai?", options: ["Amazon", "Nile", "Yangtze", "Indus"], answer: 1 },
  { q: "Insani jism mein kitni haddiyan hoti hain?", options: ["196", "206", "216", "186"], answer: 1 },
  { q: "JavaScript kis saal banayi gayi thi?", options: ["1990", "1995", "2000", "1985"], answer: 1 },
  { q: "Saurmandal ka sabse bara planet konsa hai?", options: ["Earth", "Saturn", "Jupiter", "Mars"], answer: 2 },
  { q: "Cheetah ki top speed kitni hoti hai?", options: ["60 km/h", "90 km/h", "120 km/h", "150 km/h"], answer: 2 },
  { q: "HTML ka full form kya hai?", options: ["Hyper Trainer Marking Language", "HyperText Markup Language", "Hyper Text Marketing Language", "None"], answer: 1 },
  { q: "Pakistan kab azad hua tha?", options: ["1945", "1947", "1950", "1971"], answer: 1 },
  { q: "Sabse choti prime number kya hai?", options: ["0", "1", "2", "3"], answer: 2 },
  { q: "Mount Everest kis country mein hai?", options: ["India", "China", "Nepal", "Bhutan"], answer: 2 },
  { q: "Insan ka dil ek din mein kitni baar dhadakta hai (approx)?", options: ["10,000", "50,000", "100,000", "200,000"], answer: 2 },
  { q: "WiFi ka full form kya hai?", options: ["Wireless Fidelity", "Wireless Finder", "Wire Free", "None of these"], answer: 0 },
  { q: "Sabse bara samandar konsa hai?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: 2 },
  { q: "Python programming language kis saal release hui?", options: ["1989", "1991", "1995", "2000"], answer: 1 },
  { q: "Honey kabhi expire nahi hoti — yeh sach hai ya jhoot?", options: ["Sach", "Jhoot"], answer: 0 }
];

const activeGames = new Map(); // threadID -> { question, expiresAt, listenerId }

module.exports = {
  config: {
    credits: "MR DEVIL",
    name: 'trivia',
    aliases: ['quiz'],
    description: 'Random trivia question khelo, 30 second mein reply karo!',
    usage: 'trivia',
    category: 'Fun',
    prefix: true,
    cooldowns: 5
  },
  async run({ api, event, send, Currencies }) {
    const { threadID } = event;

    if (activeGames.has(threadID)) {
      return send.reply('⚠️ Pehle se ek trivia chal rahi hai is group mein! Pehle uska jawab do.');
    }

    const picked = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    const letters = ['A', 'B', 'C', 'D'];
    const optionsText = picked.options.map((o, i) => `${letters[i]}) ${o}`).join('\n');

    const msg =
      `🧠 𝐓𝐑𝐈𝐕𝐈𝐀 𝐓𝐈𝐌𝐄!\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `❓ ${picked.q}\n\n` +
      `${optionsText}\n\n` +
      `⏱️ 30 second mein letter (A/B/C/D) reply karo!\n` +
      `💰 Sahi jawab = 15 coins + 5 XP`;

    await send(msg);

    const expiresAt = Date.now() + 30000;
    activeGames.set(threadID, { question: picked, expiresAt, answered: false });

    setTimeout(async () => {
      const game = activeGames.get(threadID);
      if (game && !game.answered) {
        const correctLetter = letters[picked.answer];
        await send(`⏰ Time up! Koi sahi jawab nahi de saka.\n✅ Sahi jawab tha: ${correctLetter}) ${picked.options[picked.answer]}`);
        activeGames.delete(threadID);
      }
    }, 30000);
  },

  // Exposed so a global message listener (or event hook) can check answers.
  _activeGames: activeGames,
  letters: ['A', 'B', 'C', 'D']
};
