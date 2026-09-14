const SYMBOLS = ['🍒', '🍋', '🍇', '🍉', '⭐', '💎', '7️⃣'];
const PAYOUTS = {
  '7️⃣7️⃣7️⃣': 10,   // 10x bet
  '💎💎💎': 7,
  '⭐⭐⭐': 5,
  '🍉🍉🍉': 4,
  '🍇🍇🍇': 3,
  '🍋🍋🍋': 2.5,
  '🍒🍒🍒': 2
};

module.exports = {
  config: {
    credits: "MR DEVIL",
    name: 'slots',
    aliases: ['slot', 'gamble'],
    description: 'Slot machine khelo apne coins ke saath. Match 3 = jeeto!',
    usage: 'slots [amount]',
    category: 'Fun',
    prefix: true,
    cooldowns: 5
  },
  async run({ event, args, send, Currencies, Users }) {
    const { senderID } = event;
    const name = await Users.getNameUser(senderID).catch(() => 'Player');

    const bet = parseInt(args[0]);
    if (!bet || bet <= 0) {
      return send.reply('🎰 Usage: .slots [amount]\nExample: .slots 50');
    }

    const balance = await Currencies.getBalance(senderID);
    if (balance < bet) {
      return send.reply(`❌ ${name}, tumhare paas sirf ${balance} coins hain. Itna bet nahi kar sakte.`);
    }
    if (bet > 5000) {
      return send.reply('⚠️ Maximum bet limit: 5000 coins.');
    }

    await Currencies.removeBalance(senderID, bet);

    const spin = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const result = [spin(), spin(), spin()];
    const key = result.join('');

    const spinAnim = await send(`🎰 [ 🎲 | 🎲 | 🎲 ]\n\nSpinning...`);

    await new Promise(r => setTimeout(r, 1500));

    let winnings = 0;
    let multiplier = PAYOUTS[key];

    // partial match (2 same) gives small consolation payout
    if (!multiplier && (result[0] === result[1] || result[1] === result[2] || result[0] === result[2])) {
      multiplier = 1.2;
    }

    if (multiplier) {
      winnings = Math.floor(bet * multiplier);
      await Currencies.addBalance(senderID, winnings);
    }

    const net = winnings - bet;
    const resultLine = `[ ${result.join(' | ')} ]`;

    let outcome;
    if (net > 0) outcome = `🎉 JACKPOT! Tum jeet gaye!\n💰 +${winnings} coins (net +${net})`;
    else if (net === 0) outcome = `😐 Break even — bet wapas mil gaya.`;
    else outcome = `😢 Better luck next time!\n💸 -${bet} coins`;

    await send(
      `🎰 𝐒𝐋𝐎𝐓 𝐌𝐀𝐂𝐇𝐈𝐍𝐄\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `${resultLine}\n\n` +
      `${outcome}`
    );
  }
};
