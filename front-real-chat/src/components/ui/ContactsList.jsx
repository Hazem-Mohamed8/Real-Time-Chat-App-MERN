import {
  setSelectedChatData,
  setSelectedChatMessages,
  setSelectedChatType,
} from "@/store/slices/chatSlice";
import { HOST } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { AvatarImage, Avatar } from "./avatar";
import { getColor } from "@/lib/utils";
import { FaUserGroup } from "react-icons/fa6";

export default function ContactsList({ contacts }) {
  const { selectedChatData } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const handleClick = (item) => {
    const isGroup = !!item.members;
    dispatch(setSelectedChatType(isGroup ? "group" : "contact"));
    dispatch(setSelectedChatData(item));
    if (selectedChatData && selectedChatData._id !== item._id) {
      dispatch(setSelectedChatMessages([]));
    }
  };

  return (
    <div className="mt-5 ml-2">
      {contacts.map((item) => {
        const isGroup = !!item.members;

        return (
          <div
            key={item._id}
            onClick={() => handleClick(item)}
            className={`p-1 mt-1 pl-2 cursor-pointer duration-300 transition-all ${
              selectedChatData && selectedChatData._id === item._id
                ? "bg-[#8417ff] hover:bg-[#8417ff]/95"
                : "hover:bg-gray-700 "
            }`}
          >
            <div className="flex gap-3 mx-3 items-center">
              <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                {isGroup ? (
                  <div className="w-12 h-12 flex items-center justify-center text-white bg-gray-600 border-white border-spacing-1 rounded-full shadow-md">
                    <FaUserGroup size={24} />
                  </div>
                ) : item.image ? (
                  <AvatarImage
                    src={`${HOST}${item.image}`}
                    alt="Profile"
                    className="w-full h-full object-cover bg-black"
                    onError={(e) => (e.target.src = "/fallback-avatar.png")}
                  />
                ) : (
                  <div
                    className={`w-10 h-10 uppercase text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      item.color
                    )}`}
                  >
                    {item.firstName
                      ? item.firstName[0].toUpperCase()
                      : item.email[0].toUpperCase()}
                  </div>
                )}
              </Avatar>
              <div className="text-white">
                <div className="text-[16px] font-semibold">
                  {isGroup ? item.name : `${item.firstName} ${item.lastName}`}
                </div>
                {isGroup && (
                  <div className="text-[12px] text-gray-400">
                    {item.members.length + 1} members
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
