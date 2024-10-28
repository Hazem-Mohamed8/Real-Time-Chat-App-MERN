import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function MessageContainer() {
  const scrollRef = useRef();
  const { selectedChatMessages } = useSelector((state) => state.chat);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = new Date(message.createdAt);
      const isSameDay =
        !lastDate || messageDate.getDate() !== new Date(lastDate).getDate();

      lastDate = message.createdAt;

      const isOwnMessage = message.sender._id === userInfo.id;

      return (
        <div key={index} className="flex flex-col gap-2">
          {/* Date Header */}
          {isSameDay && (
            <div className="text-center text-neutral-500 text-sm my-2">
              {messageDate.toLocaleDateString()}
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl break-words p-3 rounded-lg text-white ${
                isOwnMessage ? "bg-blue-500" : "bg-gray-300 text-black"
              }`}
            >
              {message.text}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="overflow-y-auto scrollbar-hidden p-4 px-8 flex-1 w-full">
      {renderMessage()}
      <div ref={scrollRef} />
    </div>
  );
}
