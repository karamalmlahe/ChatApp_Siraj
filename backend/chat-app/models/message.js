const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  timestamp: { type: Date, default: Date.now },
  message: String,
});

module.exports = mongoose.model("Message", messageSchema);