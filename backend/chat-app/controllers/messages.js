const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const firebaseAuth = require("../middlewares/firebaseAuth");

router.get("/:selectedUser", firebaseAuth, async (req, res) => {
  const currentUser = req.user.uid;
  const selectedUser = req.params.selectedUser; 
  try {
    const messages = await Message.find({
      $or: [
        { senderId: currentUser, receiverId: selectedUser },
        { senderId: selectedUser, receiverId: currentUser },
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
