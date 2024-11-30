import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useSocket } from "@/context/SocketContext";
import apiClient from "@/lib/api-client";
import { UPLOAD_FILES_MESSAGE_ROUTE } from "@/utils/constants";
import { debounce } from "lodash";

export default function MessageBar() {
  const emojiRef = useRef();

  const [message, setMessage] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { selectedChatType, selectedChatData } = useSelector(
    (state) => state.chat
  );
  const { userInfo } = useSelector((state) => state.auth);
  const socket = useSocket();

  const handleEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const emitTypingEvent = useRef(
    debounce(() => {
      if (socket?.connected && selectedChatType === "contact") {
        socket.emit("UserTyping", {
          receiver: selectedChatData._id,
          sender: userInfo.id,
        });
      }
    }, 500)
  ).current;

  const handleClickOutside = (event) => {
    if (emojiRef.current && !emojiRef.current.contains(event.target))
      setEmojiOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sendMessage = (content, type = "text", fileUrl) => {
    if (selectedChatType === "contact") {
      socket.emit("MessageSend", {
        receiver: selectedChatData._id,
        content,
        sender: userInfo.id,
        messageType: type,
        timestamp: new Date().toString(),
        fileUrl,
      });
    } else if (selectedChatType === "group") {
      socket.emit("GroupMessageSend", {
        groupId: selectedChatData._id,
        content,
        sender: userInfo.id,
        messageType: type,
        timestamp: new Date().toString(),
        fileUrl,
      });
    }
  };

  const handleMessage = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds the 5MB limit.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        UPLOAD_FILES_MESSAGE_ROUTE,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.filePath && selectedChatType === "contact") {
        socket.emit("MessageSend", {
          receiver: selectedChatData._id,
          content: undefined,
          sender: userInfo.id,
          messageType: "file",
          timestamp: new Date().toString(),
          fileUrl: response.data.filePath,
        });
      } else if (response.data.filePath && selectedChatType === "group") {
        socket.emit("GroupMessageSend", {
          groupId: selectedChatData._id,
          content: undefined,
          sender: userInfo.id,
          messageType: "file",
          timestamp: new Date().toString(),
          fileUrl: response.data.filePath,
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-[10vh] flex justify-center items-center px-8 mb-2 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md gap-5 items-center pr-5">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none rounded-lg p-3 text-white"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            emitTypingEvent();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleMessage()}
        />
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          tabIndex={0}
          className={`text-2xl text-neutral-500 cursor-pointer ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
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
              className="absolute bottom-16 no-scrollbar right-0"
              ref={emojiRef}
              onClick={(e) => e.stopPropagation()}
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
        className={`bg-[#8417ff] rounded-lg p-[11px] flex justify-center items-center ${
          isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#741bda]"
        }`}
        onClick={handleMessage}
        disabled={isUploading}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
}
