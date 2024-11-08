const { Server: SocketIoServer } = require("socket.io");
const Message = require("./models/messagesModel");

const setUpSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userMap = new Map();

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
      console.log("User ID is missing in the handshake query.");
      socket.disconnect(true);
      return;
    }

    userMap.set(userId, socket.id);
    // console.log(`New client ${userId} connected: ${socket.id}`);

    socket.on("MessageSend", async (data) => {
      const { receiver, sender } = data;

      if (!sender || !receiver) {
        console.error("Invalid message data: sender or receiver is missing");
        return;
      }

      const senderSocketId = userMap.get(sender);
      const receiverSocketId = userMap.get(receiver);

      try {
        const createdMessage = await Message.create(data);
        const messageData = await Message.findById(createdMessage._id)
          .populate("sender", "id firstName lastName image color email")
          .populate("receiver", "id firstName lastName image color email");

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("MessageReceive", messageData);
        }

        if (senderSocketId) {
          io.to(senderSocketId).emit("MessageReceive", messageData);
        }
      } catch (error) {
        console.error("Error handling MessageSend event:", error);
      }
    });

    socket.on("disconnect", () => {
      const userId = socket.handshake.query.userId;
      if (userId) {
        userMap.delete(userId);
        console.log(`Client ${userId} disconnected: ${socket.id}`);
      }
    });
  });

  return io;
};

module.exports = setUpSocket;
