import { createContext, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  addDMMessageInList,
  addGroupInList,
  addMessage,
} from "@/store/slices/chatSlice";
import { HOST } from "@/utils/constants";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);
  const { selectedChatType, selectedChatData } = useSelector(
    (state) => state.chat
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) return;

    socket.current = io(HOST, {
      withCredentials: true,
      query: { userId: userInfo.id },
    });

    socket.current.on("connect", () => {});

    const handleReceiveMessage = (data) => {
      if (
        selectedChatType &&
        (selectedChatData._id === data.sender._id ||
          selectedChatData._id === data.receiver._id)
      ) {
        dispatch(addMessage(data));

        dispatch(addDMMessageInList({ ...data, userId: userInfo.id }));
      }
    };

    const handleReceiveGroupMessage = (data) => {
      if (
        selectedChatType === "group" &&
        selectedChatData._id === data.groupId
      ) {
        dispatch(addMessage(data));
        dispatch(addGroupInList(data));
      }
    };

    socket.current.on("MessageReceive", handleReceiveMessage);
    socket.current.on("GroupMessageReceive", handleReceiveGroupMessage);
  }, [userInfo, selectedChatType, selectedChatData, dispatch]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
