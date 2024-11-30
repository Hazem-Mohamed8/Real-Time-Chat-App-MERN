import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { closeChat } from "@/store/slices/chatSlice";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

export default function ChatHeader() {
  const dispatch = useDispatch();
  const { selectedChatData, selectedChatType } = useSelector(
    (state) => state.chat
  );

  return (
    <div className="h-[8vh] bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 border-b border-purple-800 flex items-center">
      <div className="flex items-center justify-between gap-5 w-full px-6">
        {/* Left Section: Avatar and Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 relative">
            {selectedChatType === "group" ? (
              <div className="w-12 h-12 flex items-center justify-center text-white bg-purple-800 rounded-full">
                <FaUserGroup size={28} className="text-white" />
              </div>
            ) : (
              <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}${selectedChatData.image}`}
                    alt="Profile"
                    className="w-full h-full object-cover bg-black"
                    onError={(e) => (e.target.src = "/fallback-avatar.png")}
                  />
                ) : (
                  <div
                    className={`w-12 h-12 uppercase text-lg flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName[0].toUpperCase()
                      : selectedChatData.email[0].toUpperCase()}
                  </div>
                )}
              </Avatar>
            )}
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-lg font-semibold text-white">
              {selectedChatType === "group"
                ? selectedChatData.name
                : `${selectedChatData.firstName} ${selectedChatData.lastName}`}
            </h1>
            {selectedChatType === "group" && (
              <p className="text-sm text-purple-200">
                {selectedChatData.members?.length + 1 || 0} members
              </p>
            )}
          </div>
        </div>
        {/* Right Section: Close Button */}
        <div>
          <button
            className="text-white hover:text-purple-300 focus:outline-none transition-all"
            onClick={() => dispatch(closeChat())}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
