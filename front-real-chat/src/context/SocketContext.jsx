import { createContext, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { addMessage } from "@/store/slices/chatSlice";
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

    socket.current.on("connect", () => {
      console.log("Connected to socket server");
    });

    const handleReceiveMessage = (data) => {
      if (
        selectedChatType &&
        (selectedChatData._id === data.sender._id ||
          selectedChatData._id === data.receiver._id)
      ) {
        dispatch(addMessage(data));
      }
    };

    socket.current.on("MessageReceive", handleReceiveMessage);
  }, [userInfo, selectedChatType, selectedChatData, dispatch]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
