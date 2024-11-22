import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import apiClient from "@/lib/api-client";
import { GET_MESSAGE_ROUTE, HOST } from "@/utils/constants";
import { setSelectedChatMessages } from "@/store/slices/chatSlice";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowDown } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa";

export default function MessageContainer() {
  const scrollRef = useRef();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { selectedChatMessages, selectedChatType, selectedChatData } =
    useSelector((state) => state.chat);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMessages = async () => {
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
    };

    if (selectedChatData._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatData, selectedChatType, dispatch]);

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

  const getMessageStyles = (isOwnMessage) =>
    `relative ${
      isOwnMessage ? "bg-[#8417ff] text-white" : "bg-[#2a2b38] text-white"
    } rounded-lg p-3 my-1 max-w-[40%] shadow-md break-words ${
      isOwnMessage ? "rounded-br-none" : "rounded-bl-none"
    }`;

  const renderDMMessage = (message, index) => {
    const isOwnMessage = message.sender === userInfo.id;
    const messageTime = format(new Date(message.createdAt), "HH:mm");

    return (
      <div
        key={message._id || index}
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        {message.messageType === "text" && (
          <div className={getMessageStyles(isOwnMessage)}>
            <div className="mb-2">{message.content}</div>
            <span className="absolute bottom-1 right-1.5 text-[10px] text-gray-300">
              {messageTime}
            </span>
          </div>
        )}
        {message.messageType === "file" && (
          <div className={getMessageStyles(isOwnMessage)}>
            <div className="flex items-center gap-2">
              {isImageFile(message.fileUrl) ? (
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt="Uploaded file"
                  width={200}
                  height={200}
                  className="rounded-md mb-2 inline-block"
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
    </div>
  );
}
