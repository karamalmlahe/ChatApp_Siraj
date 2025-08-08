const express = require("express");
const router = express.Router();
const firebaseAuth = require("../middlewares/firebaseAuth");
const admin = require("../config/firebase");

router.get("/", firebaseAuth, async (req, res) => {
  try {
    const currentUser = req.user;
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users
      .filter((user) => user.uid !== currentUser.uid)
      .map((user) => ({
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }));
    res.json({ users });
  } catch (err) {
    res.status(500).json({});
  }
});

module.exports = router;
