/**
 * Listens for A/B/C/D replies in groups that have an active trivia game
 * (started via the `trivia` command) and awards coins + XP for correct answers.
 */

let triviaModule = null;
function getTriviaModule() {
  if (!triviaModule) {
    try { triviaModule = require('../commands/trivia.js'); } catch (e) { triviaModule = null; }
  }
  return triviaModule;
}

module.exports = {
  config: {
    credits: "MR DEVIL",
    name: "triviaListener",
    eventType: "message",
    description: "Trivia game ke jawabaat check karta hai aur reward deta hai."
  },

  async run({ api, event, send, Currencies, Users }) {
    const trivia = getTriviaModule();
    if (!trivia || !trivia._activeGames) return;

    const { threadID, body, senderID } = event;
    if (!body) return;

    const game = trivia._activeGames.get(threadID);
    if (!game || game.answered) return;
    if (Date.now() > game.expiresAt) { trivia._activeGames.delete(threadID); return; }

    const letters = trivia.letters;
    const guess = body.trim().toUpperCase();
    const guessIndex = letters.indexOf(guess);
    if (guessIndex === -1) return; // not an A/B/C/D reply, ignore silently

    const correctIndex = game.question.answer;

    if (guessIndex === correctIndex) {
      game.answered = true;
      trivia._activeGames.delete(threadID);

      const name = await Users.getNameUser(senderID).catch(() => 'Player');
      await Currencies.addBalance(senderID, 15);
      await Currencies.addExp(senderID, 5);

      await send(
        `🎉 Sahi jawab, ${name}!\n` +
        `✅ ${letters[correctIndex]}) ${game.question.options[correctIndex]}\n` +
        `💰 +15 coins | ⭐ +5 XP`
      );
      api.setMessageReaction('🎉', event.messageID, () => {}, true);
    }
    // wrong guesses are ignored silently so chat doesn't get spammed
  }
};
