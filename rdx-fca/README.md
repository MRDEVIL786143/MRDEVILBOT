# MR DEVIL-FCA

**Facebook Chat API for Node.js - Enhanced by MR DEVIL**

A powerful unofficial Facebook Chat API built and maintained by MR DEVIL.

## Features

- 🔥 **Auto Reconnect** - Stable connection with automatic re-login
- ⚡ **MQTT Support** - Real-time message listening
- 🎯 **Enhanced Modules** - Combined features from both parent FCAs
- 🛡️ **Error Handling** - Robust error handling to prevent crashes
- 📦 **SQLite Database** - Built-in local storage support
- 🔄 **Auto Update** - Automatic version checking
- 📝 **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install MR DEVIL-fca
```

## Quick Start

```javascript
const mrDevilFca = require("MR DEVIL-fca");
const fs = require("fs");

const loginData = JSON.parse(fs.readFileSync("appState.json"));

mrDevilFca(loginData, (err, api) => {
  if (err) return console.error(err);
  
  console.log("MR DEVIL-FCA logged in!");
  
  api.listenMqtt((err, message) => {
    if (message.body) {
      console.log(`Message: ${message.body}`);
    }
  });
});
```

## API Methods

### Messaging
- `sendMessage(threadID, message)`
- `sendTypingIndicator(threadID)`
- `setMessageReaction(messageID, reaction)`
- `deleteMessage(messageID)`
- `editMessage(messageID, newText)`
- `forwardMessage(messageID, threadID)`

### Threads
- `getThreadList(limit)`
- `getThreadInfo(threadID)`
- `getThreadHistory(threadID, limit)`
- `getThreadPictures(threadID)`
- `createNewGroup(name, participants)`
- `addUserToGroup(userID, threadID)`
- `removeUserFromGroup(userID, threadID)`
- `changeThreadColor(color, threadID)`
- `changeThreadEmoji(emoji, threadID)`
- `setTitle(title, threadID)`
- `muteThread(threadID, muteTime)`
- `pinMessage(threadID, pin)`
- `deleteThread(threadID)`

### Users
- `getCurrentUserID()`
- `getUserInfo(userIDs)`
- `getUserID(username)`
- `getFriendsList()`
- `changeAvatar(imagePath)`
- `changeBio(bio)`
- `changeName(firstName, lastName)`

### Actions
- `handleFriendRequest(userID, accept)`
- `handleMessageRequest(threadID, accept)`
- `changeAdminStatus(userID, threadID, admin)`
- `changeBlockedStatus(userID, block)`
- `unfriend(userID)`
- `logout()`

## Configuration

Create `appState.json` with your Facebook cookies:

```json
[
  {"key": "c_user", "value": "your_user_id"},
  {"key": "xs", "value": "your_session_token"}
]
```

## Options

```javascript
mrDevilFca(loginData, {
  selfListen: false,
  listenEvents: false,
  listenTyping: false,
  autoMarkRead: false,
  autoReconnect: true,
  online: true
}, callback);
```

## Credits

- **MR DEVIL** - Owner & Developer

## License

MIT License

---

**MR DEVIL-FCA v1.0.0** | Owner: MR DEVIL | Combined Best Features
