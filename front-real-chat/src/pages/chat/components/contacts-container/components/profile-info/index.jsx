import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import apiClient from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { setUserInfo } from "@/store/slices/authSlice";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { FiEdit2, FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProfileInfo() {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch(setUserInfo(null));
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!userInfo) return null;

  const handleNavigate = (path) => () => navigate(path);

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-8 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="w-12 h-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}${userInfo.image}`}
                alt="Profile"
                className="w-full h-full object-cover bg-black"
                onError={(e) => (e.target.src = "/fallback-avatar.png")}
              />
            ) : (
              <div
                className={`w-12 h-12 uppercase text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName[0].toUpperCase()
                  : userInfo.email[0].toUpperCase()}
              </div>
            )}
          </Avatar>
        </div>

        <div className="text-white text-[16px] font-medium">
          {userInfo.firstName || "User"} {userInfo.lastName || "Name"}
        </div>
      </div>
      <div className="flex gap-5 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-purple-500 text-xl font-medium cursor-pointer"
                onClick={handleNavigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none">
              <p className="text-white">Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiLogOut
                className="text-red-500 text-xl font-medium cursor-pointer"
                onClick={logOut}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none">
              <p className="text-white">Log out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
