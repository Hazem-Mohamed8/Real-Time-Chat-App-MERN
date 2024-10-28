import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { closeChat } from "@/store/slices/chatSlice";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

export default function ChatHeader() {
  const dispatch = useDispatch();
  const { selectedChatData, selectedChatType } = useSelector(
    (state) => state.chat
  );

  return (
    <div className="h-[8vh] border-b-2 border-[#2f303b] bg-purple-500 flex items-center ">
      <div className="flex items-center justify-between gap-5  w-full px-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 relative">
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
                  className={`w-12 h-12 uppercase text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedChatData.color
                  )}`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName[0].toUpperCase()
                    : selectedChatData.email[0].toUpperCase()}
                </div>
              )}
            </Avatar>
          </div>
          <div className="flex flex-col items-start justify-center">
            {selectedChatType &&
            selectedChatData.firstName &&
            selectedChatData.lastName ? (
              <h1 className="text-lg font-bold text-white">
                {selectedChatData.firstName} {selectedChatData.lastName}
              </h1>
            ) : (
              <h1 className="text-lg font-bold text-white">
                {selectedChatData.email}
              </h1>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-2xl text-neutral-100  focus:border-none focus:outline-none focus:text-white duration-300 translation-all"
            onClick={() => dispatch(closeChat())}
          >
            <RiCloseFill className="text-2xl font-bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
