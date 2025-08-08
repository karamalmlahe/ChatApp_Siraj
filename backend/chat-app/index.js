const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const { setupWebSocket } = require("./websocket/server");
const messagesRoute = require("./controllers/messages");
const userRoutes = require("./controllers/users");

app.use(bodyParser.urlencoded({ extends: false }));
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT || 3000;

const url = process.env.MONGODB_URL;
mongoose
  .connect(url)
  .then(() => {
    const server = app.listen(port, function () {
      console.log(`Server is runing via port ${port}`);
    });
    setupWebSocket(server);
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/messages", messagesRoute);
app.use("/api/users", userRoutes);
