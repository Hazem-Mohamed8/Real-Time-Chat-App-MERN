const { Server: SocketIoServer } = require("socket.io");
const Message = require("./models/messagesModel");
const Group = require("./models/groupModel");

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

    socket.on("GroupMessageSend", async (data) => {
      const { groupId, sender, content, fileUrl, messageType } = data;

      // Validation check for missing sender or groupId
      if (!sender || !groupId) {
        console.error("Invalid message data: sender or groupId is missing");
        return;
      }

      try {
        // Create the new message in the database
        const createdMessage = await Message.create({
          sender,
          receiver: null,
          content,
          fileUrl,
          messageType,
          timestamp: new Date(),
        });

        // Fetch the created message and populate sender details
        const messageData = await Message.findById(createdMessage._id)
          .populate("sender", "id firstName lastName image color email")
          .exec();

        // Add the message to the group's message list
        await Group.findByIdAndUpdate(groupId, {
          $push: { messages: createdMessage._id },
        });

        // Fetch the group details with members
        const group = await Group.findById(groupId).populate("members");

        // Prepare final data to be sent to clients
        let finalData = {
          ...messageData._doc,
          groupId: group._id,
        };

        // Check if group and members exist
        if (group && group.members) {
          // Iterate over the members and send the message to each connected socket
          group.members.forEach((member) => {
            const memberSocketId = userMap.get(member._id.toString());
            if (memberSocketId) {
              io.to(memberSocketId).emit("GroupMessageReceive", finalData);
            }
          });

          // Send message to the admin as well
          const adminSocketId = userMap.get(group.admin._id.toString());
          if (adminSocketId) {
            io.to(adminSocketId).emit("GroupMessageReceive", finalData);
          }
        } else {
          console.error("Group or group members not found");
        }

        // Optionally send back a confirmation response to the client
        socket.emit("GroupMessageStatus", {
          success: true,
          message: "Message sent successfully",
        });
      } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error handling GroupMessageSend event:", error);
        socket.emit("GroupMessageStatus", {
          success: false,
          message: "Failed to send message",
        });
      }
    });

    socket.on("disconnect", () => {
      const userId = socket.handshake.query.userId;
      if (userId) {
        userMap.delete(userId);
      }
    });
  });

  return io;
};

module.exports = setUpSocket;
