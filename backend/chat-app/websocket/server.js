const { WebSocketServer } = require("ws");
const admin = require("../config/firebase");
const Message = require("../models/message");

const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });
  const sessions = new Map();

  wss.on("connection", async (ws, req) => {
    const params = new URLSearchParams(req.url.replace("/?", ""));
    const token = params.get("token");
    if (!token) {
      ws.close();
      return;
    }
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      const userId = decoded.uid;
      sessions.set(userId, ws);

      ws.on("message", async (data) => {
        let msg;
        try {
          msg = JSON.parse(data);
        } catch {
          return;
        }        
        const chatMsg = new Message({
          senderId: userId,
          receiverId: msg.receiverId,
          message: msg.message,
          timestamp: new Date(),
        });
        await chatMsg.save();

        const recipientWs = sessions.get(msg.receiverId);
        if (recipientWs && recipientWs.readyState === 1) {
          recipientWs.send(JSON.stringify(chatMsg));
        }
      });

      ws.on("close", () => {
        sessions.delete(userId);
      });
    } catch {
      ws.close();
    }
  });
};

module.exports = { setupWebSocket };
