import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerFill } from "react-icons/ri";
import "./styleEmoi.css";
import { useSelector } from "react-redux";
import { useSocket } from "@/context/SocketContext";

export default function MessageBar() {
  const emojiRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const { selectedChatType, selectedChatData } = useSelector(
    (state) => state.chat
  );
  const { userInfo } = useSelector((state) => state.auth);
  const socket = useSocket();

  const handleEmoji = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  const handleTyping = () => {
    if (socket && selectedChatType === "contact") {
      socket.emit("UserTyping", {
        receiver: selectedChatData._id,
        sender: userInfo.id,
      });
    }
  };

  const handleClickOutside = (event) => {
    if (emojiRef.current && !emojiRef.current.contains(event.target)) {
      setEmojiOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMessage = async () => {
    if (message.trim() === "") return;

    if (socket && selectedChatType === "contact") {
      socket.emit("MessageSend", {
        receiver: selectedChatData._id,
        content: message,
        sender: userInfo.id,
        messageType: "text",
        timestamp: new Date().toString(),
        fileUrl: undefined,
      });
      setMessage("");
    }
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file && socket) {
  //     socket.emit("FileSend", {
  //       receiver: selectedChatData._id,
  //       sender: userInfo.id,
  //       fileUrl: URL.createObjectURL(file),
  //       messageType: "file",
  //       timestamp: new Date().toString(),
  //     });
  //   }
  // };

  return (
    <div className="h-[10vh] flex justify-center items-center px-8 mb-2 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md gap-5 items-center pr-5">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none rounded-lg p-3 text-white focus:border-none focus:outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleMessage();
          }}
        />
        {/* <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
        /> */}
        <label
          htmlFor="file-upload"
          className="text-2xl text-neutral-500 cursor-pointer"
        >
          <GrAttachment className="text-2xl" />
        </label>
        <div className="relative">
          <button
            className="text-2xl text-neutral-500"
            onClick={() => setEmojiOpen(!emojiOpen)}
          >
            <RiEmojiStickerFill className="text-2xl" />
          </button>
          {emojiOpen && (
            <div
              className="absolute bottom-16 right-0"
              ref={emojiRef}
              onClick={(e) => e.stopPropagation()} // Prevent emoji picker from closing when clicking inside
            >
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-lg p-[11px] hover:bg-[#741bda] flex justify-center items-center"
        onClick={handleMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
}
