const admin = require("../config/firebase");

const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({});
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    req.user = userRecord;
    next();
  } catch (err) {
    res.status(401).json({});
  }
};

module.exports = firebaseAuth;
