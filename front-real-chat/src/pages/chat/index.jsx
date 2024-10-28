import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container";
import ContactsContainer from "./components/contacts-container";
import EmptyChat from "./components/empty-chat";

export default function Chat() {
  const { userInfo } = useSelector((state) => state.auth);
  const { selectedChatData, selectedChatType } = useSelector(
    (state) => state.chat
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please satup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  if (!userInfo) {
    return <div>You are not logged in. Please log in to access the chat.</div>;
  }

  return (
    <div className="flex text-white overflow-hidden  h-screen w-screen">
      <ContactsContainer />
      {selectedChatType && selectedChatData ? <ChatContainer /> : <EmptyChat />}
    </div>
  );
}
