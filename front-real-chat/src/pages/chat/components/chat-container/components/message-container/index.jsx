import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import apiClient from "@/lib/api-client";
import { GET_MESSAGE_ROUTE } from "@/utils/constants";
import { setSelectedChatMessages } from "@/store/slices/chatSlice";

export default function MessageContainer() {
  const scrollRef = useRef();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { selectedChatMessages } = useSelector((state) => state.chat);
  const { selectedChatType, selectedChatData } = useSelector(
    (state) => state.chat
  );
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
        console.log(error);
      }
    };
    if (selectedChatData._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatType, selectedChatData, dispatch]);

  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages, isAtBottom]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    setIsAtBottom(scrollHeight - scrollTop === clientHeight);
  };

  const renderMessage = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      console.log(selectedChatMessages);

      const messageDate = new Date(message.createdAt);
      const isSameDay =
        !lastDate || messageDate.getDate() !== new Date(lastDate).getDate();
      lastDate = message.createdAt;

      return (
        <div key={index} className="flex flex-col gap-2 animate-fade-in">
          {isSameDay && (
            <div className="text-center text-neutral-500 text-sm my-2">
              {format(messageDate, "MMMM d, yyyy")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessage(message, index)}
        </div>
      );
    });
  };

  const renderDMMessage = (message, index) => {
    const isOwnMessage = message.sender === userInfo.id;
    const messageTime = format(new Date(message.createdAt), "HH:mm");

    return (
      <div
        key={index}
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`relative ${
            isOwnMessage ? "bg-[#8417ff] text-white" : "bg-[#2a2b38] text-white"
          } rounded-lg p-3 pr-8 my-1 max-w-[40%] shadow-md break-words ${
            isOwnMessage ? "rounded-br-none" : "rounded-bl-none"
          }`}
        >
          <div className="mb-2">{message.content}</div>

          <span className="absolute bottom-1 right-1.5 text-[10px] text-gray-300">
            {messageTime}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      onScroll={handleScroll}
      className="overflow-y-auto no-scrollbar p-4 px-8 flex-1 w-full"
    >
      {renderMessage()}
      <div ref={scrollRef} />
    </div>
  );
}
