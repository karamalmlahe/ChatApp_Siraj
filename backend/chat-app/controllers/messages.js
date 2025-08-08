const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const firebaseAuth = require("../middlewares/firebaseAuth");

router.get("/", firebaseAuth, async (req, res) => {
  const user1 = req.user.uid;
  const { user2 } = req.query;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ timestamp: 1 });
    res.json({
      messages,
    });
  } catch (err) {
    res.status(500).json({});
  }
});

module.exports = router;
