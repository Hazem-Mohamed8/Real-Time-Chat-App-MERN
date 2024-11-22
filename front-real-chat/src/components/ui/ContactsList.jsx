import {
  setSelectedChatData,
  setSelectedChatMessages,
  setSelectedChatType,
} from "@/store/slices/chatSlice";
import { HOST } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { AvatarImage, Avatar } from "./avatar";
import { getColor } from "@/lib/utils";

export default function ContactsList({ contacts, isGroup = false }) {
  const { selectedChatData } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const handleClick = (contact) => {
    if (isGroup) dispatch(setSelectedChatType("group"));
    else dispatch(setSelectedChatType("contact"));
    dispatch(setSelectedChatData(contact));
    if (selectedChatData && selectedChatData._id !== contact._id) {
      dispatch(setSelectedChatMessages([]));
    }
  };

  return (
    <div className="mt-5 ml-2">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          onClick={() => handleClick(contact)}
          className={`p-1 mt-1 pl-2 cursor-pointer duration-300 transition-all ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]/95"
              : "hover:bg-gray-700 "
          }`}
        >
          <div className="flex gap-3 mx-3 items-center">
            <Avatar className="w-10 h-10 rounded-full overflow-hidden">
              {contact.image ? (
                <AvatarImage
                  src={`${HOST}${contact.image}`}
                  alt="Profile"
                  className="w-full h-full object-cover bg-black"
                  onError={(e) => (e.target.src = "/fallback-avatar.png")}
                />
              ) : (
                <div
                  className={`w-10 h-10 uppercase text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                    contact.color
                  )}`}
                >
                  {contact.firstName
                    ? contact.firstName[0].toUpperCase()
                    : contact.email[0].toUpperCase()}
                </div>
              )}
            </Avatar>
            <div className="text-white">
              <div className="text-[16px] font-semibold">
                {contact.firstName} {contact.lastName}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
