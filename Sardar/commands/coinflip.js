module.exports = {
  config: {
    credits: "MR DEVIL",
    name: 'coinflip',
    aliases: ['cf', 'flip'],
    description: 'Heads ya tails pe bet lagao, jeeto double!',
    usage: 'coinflip [heads/tails] [amount]',
    category: 'Fun',
    prefix: true,
    cooldowns: 3
  },
  async run({ event, args, send, Currencies, Users }) {
    const { senderID } = event;
    const name = await Users.getNameUser(senderID).catch(() => 'Player');

    const choice = (args[0] || '').toLowerCase();
    const bet = parseInt(args[1]);

    if (!['heads', 'tails', 'h', 't'].includes(choice) || !bet || bet <= 0) {
      return send.reply('🪙 Usage: .coinflip [heads/tails] [amount]\nExample: .coinflip heads 100');
    }

    const balance = await Currencies.getBalance(senderID);
    if (balance < bet) {
      return send.reply(`❌ ${name}, tumhare paas sirf ${balance} coins hain.`);
    }
    if (bet > 10000) {
      return send.reply('⚠️ Maximum bet: 10,000 coins.');
    }

    const userChoice = choice.startsWith('h') ? 'heads' : 'tails';
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = userChoice === result;

    await send(`🪙 Sikka uchal raha hai...`);
    await new Promise(r => setTimeout(r, 1500));

    if (won) {
      await Currencies.addBalance(senderID, bet);
      await send(
        `🪙 𝐂𝐎𝐈𝐍𝐅𝐋𝐈𝐏\n━━━━━━━━━━━━━━━━━━━━\n` +
        `Result: ${result === 'heads' ? '👑 HEADS' : '🔄 TAILS'}\n\n` +
        `🎉 Tum jeet gaye, ${name}!\n💰 +${bet} coins`
      );
    } else {
      await Currencies.removeBalance(senderID, bet);
      await send(
        `🪙 𝐂𝐎𝐈𝐍𝐅𝐋𝐈𝐏\n━━━━━━━━━━━━━━━━━━━━\n` +
        `Result: ${result === 'heads' ? '👑 HEADS' : '🔄 TAILS'}\n\n` +
        `😢 Tum haar gaye, ${name}.\n💸 -${bet} coins`
      );
    }
  }
};
