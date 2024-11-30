const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL;

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// MongoDB Connection
mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Routes
const authRoutes = require("./routes/authRoute.js");
const contactsRouter = require("./routes/contactsRoute.js");
const setUpSocket = require("./socket.js");
const messageRoutes = require("./routes/messageRoute.js");
const groupRoutes = require("./routes/groupRoute.js");

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRouter);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Setup Socket.io
setUpSocket(server);
