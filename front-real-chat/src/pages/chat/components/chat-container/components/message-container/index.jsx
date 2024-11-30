import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import clsx from "clsx";
import apiClient from "@/lib/api-client";
import {
  GET_GROUP_MESSAGES_ROUTE,
  GET_MESSAGE_ROUTE,
  HOST,
} from "@/utils/constants";
import { setSelectedChatMessages } from "@/store/slices/chatSlice";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowDown } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa";
import { Avatar } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function MessageContainer() {
  const scrollRef = useRef();
  const imageRef = useRef();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [imageShow, setImageShow] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const { selectedChatMessages, selectedChatType, selectedChatData } =
    useSelector((state) => state.chat);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleClickOutside = (event) => {
    if (imageRef.current && !imageRef.current.contains(event.target)) {
      setImageShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setImageShow(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await apiClient.post(
        GET_MESSAGE_ROUTE,
        { id: selectedChatData._id },
        { withCredentials: true }
      );
      if (response.data.messages) {
        dispatch(setSelectedChatMessages(response.data.messages));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [selectedChatData, dispatch]);

  const fetchGroupMessages = useCallback(async () => {
    try {
      const response = await apiClient.post(
        GET_GROUP_MESSAGES_ROUTE,
        { id: selectedChatData._id },
        { withCredentials: true }
      );
      if (response.data.messages) {
        dispatch(setSelectedChatMessages(response.data.messages));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [selectedChatData, dispatch]);

  useEffect(() => {
    if (selectedChatData._id && selectedChatType === "contact") {
      fetchMessages();
    } else if (selectedChatData._id && selectedChatType === "group") {
      fetchGroupMessages();
    }
  }, [selectedChatData, selectedChatType, fetchMessages, fetchGroupMessages]);

  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    setIsAtBottom(scrollHeight - scrollTop === clientHeight);
  };

  const isImageFile = (filePath) =>
    /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|tiff|tif)$/i.test(filePath);

  const downloadFile = async (filePath) => {
    try {
      const response = await apiClient.get(`${HOST}/${filePath}`, {
        responseType: "blob",
        withCredentials: true,
      });

      const urlBlob = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", filePath.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const isSameDay = (lastDate, messageDate) =>
    !lastDate || new Date(lastDate).getDate() !== messageDate.getDate();

  const renderDMMessage = (message, index) => {
    const isOwnMessage = message.sender === userInfo.id;
    const messageTime = format(new Date(message.createdAt), "HH:mm");

    const messageClass = clsx(
      "relative rounded-lg p-3 my-1 max-w-[40%] shadow-md break-words",
      isOwnMessage
        ? "bg-[#8417ff] text-white rounded-tr-none self-end"
        : "bg-[#2a2b38] text-white rounded-tl-none"
    );

    return (
      <div
        key={message._id || index}
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        {message.messageType === "text" && (
          <div className={messageClass}>
            <div className="mb-2">{message.content}</div>
            <span className="absolute bottom-1 right-1.5 text-[10px] text-gray-300">
              {messageTime}
            </span>
          </div>
        )}
        {message.messageType === "file" && (
          <div className={messageClass}>
            <div className="flex items-center gap-2">
              {isImageFile(message.fileUrl) ? (
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt="Uploaded file"
                  width={200}
                  height={200}
                  className="rounded-md mb-2 inline-block cursor-pointer hover:opacity-90 transition-all duration-300"
                  onClick={() => {
                    setImageShow(true);
                    setImageUrl(message.fileUrl);
                  }}
                />
              ) : (
                <>
                  <span className="text-xl text-white mb-2 inline-block">
                    {message.fileUrl.endsWith(".pdf") ? (
                      <FaRegFilePdf />
                    ) : (
                      <MdFolderZip />
                    )}
                  </span>
                  <span className="text-white font-medium mb-1 inline-block truncate max-w-[200px]">
                    {message.fileUrl.split("/").pop()}
                  </span>
                  <button
                    onClick={() => downloadFile(message.fileUrl)}
                    className="p-2 bg-purple-500 rounded-lg mb-2 inline-block hover:bg-purple-600 transition"
                    aria-label="Download file"
                  >
                    <IoMdArrowDown />
                  </button>
                </>
              )}
            </div>
            <span className="absolute bottom-1 right-1.5 text-[10px] text-gray-300">
              {messageTime}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderGroupMessage = (message, index) => {
    const isOwnMessage = message.sender._id === userInfo.id;
    const messageTime = format(new Date(message.createdAt), "HH:mm");
    const userColor = message.sender.color || "#8417ff";
    const userImageUrl = `${HOST}${message.sender.image}`;

    const messageClass = clsx(
      "relative rounded-lg p-3 my-1 max-w-[65%] shadow-md break-words",
      isOwnMessage
        ? "bg-[#8417ff] text-white rounded-tr-none self-end"
        : "bg-[#2a2b38] text-white rounded-tl-none"
    );

    return (
      <div
        key={message._id || index}
        className={`flex ${
          isOwnMessage ? "justify-end" : "justify-start"
        } items-start`}
      >
        {!isOwnMessage && (
          <div className="mr-2">
            <Avatar className="w-10 h-10 rounded-full overflow-hidden">
              {message.sender.image ? (
                <AvatarImage
                  src={userImageUrl}
                  alt={`${message.sender.firstName} ${message.sender.lastName}`}
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full uppercase font-bold text-white ${getColor(
                    userColor
                  )}`}
                >
                  {message.sender.firstName
                    ? message.sender.firstName[0].toUpperCase()
                    : message.sender.email[0].toUpperCase()}
                </div>
              )}
            </Avatar>
          </div>
        )}

        <div className={messageClass}>
          {message.messageType === "text" && (
            <div>
              <div className="mb-2">{message.content}</div>
              <span className="absolute bottom-1 right-1.5 text-[10px] text-gray-300">
                {messageTime}
              </span>
            </div>
          )}
          {message.messageType === "file" && (
            <div>
              <div className="flex items-center gap-2">
                {isImageFile(message.fileUrl) ? (
                  <img
                    src={`${HOST}/${message.fileUrl}`}
                    alt="Uploaded file"
                    width={200}
                    height={200}
                    className="rounded-md mb-2 inline-block cursor-pointer hover:opacity-90 transition-all duration-300"
                    onClick={() => {
                      setImageShow(true);
                      setImageUrl(message.fileUrl);
                    }}
                  />
                ) : (
                  <>
                    <span className="text-xl text-white mb-2 inline-block">
                      {message.fileUrl.endsWith(".pdf") ? (
                        <FaRegFilePdf />
                      ) : (
                        <MdFolderZip />
                      )}
                    </span>
                    <span className="text-white font-medium mb-1 inline-block truncate max-w-[200px]">
                      {message.fileUrl.split("/").pop()}
                    </span>
                    <button
                      onClick={() => downloadFile(message.fileUrl)}
                      className="p-2 bg-purple-500 rounded-lg mb-2 inline-block hover:bg-purple-600 transition"
                      aria-label="Download file"
                    >
                      <IoMdArrowDown />
                    </button>
                  </>
                )}
              </div>
              <span className="absolute bottom-1 right-1.5 text-[10px] text-gray-300">
                {messageTime}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = new Date(message.createdAt);
      const showDate = isSameDay(lastDate, messageDate);
      lastDate = message.createdAt;

      return (
        <div
          key={message._id || index}
          className="flex flex-col gap-2 animate-fade-in"
        >
          {showDate && (
            <div className="text-center text-neutral-500 text-sm my-2">
              {format(messageDate, "MMMM d, yyyy")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessage(message, index)}
          {selectedChatType === "group" && renderGroupMessage(message, index)}
        </div>
      );
    });
  };

  return (
    <div
      onScroll={handleScroll}
      className="overflow-y-auto no-scrollbar p-4 px-8 flex-1 w-full"
    >
      {renderMessages()}
      <div ref={scrollRef} />
      {imageShow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-labelledby="image-modal"
          aria-hidden={!imageShow}
        >
          <div className="relative">
            <img
              src={`${HOST}/${imageUrl}`}
              alt="Preview"
              className="max-w-[80vw] max-h-[80vh] object-contain rounded-lg shadow-xl"
              ref={imageRef}
            />

            <button
              onClick={() => downloadFile(imageUrl)}
              className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-transform transform hover:scale-105"
              aria-label="Download Image"
              aria-hidden={!imageShow}
              ref={imageRef}
            >
              <IoMdArrowDown size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
