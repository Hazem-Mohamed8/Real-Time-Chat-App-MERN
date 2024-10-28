import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChatType: (state, action) => {
      state.selectedChatType = action.payload;
    },

    setSelectedChatData: (state, action) => {
      state.selectedChatData = action.payload;
    },

    setSelectedChatMessages: (state, action) => {
      state.selectedChatMessages = action.payload;
    },

    closeChat: (state) => {
      state.selectedChatType = undefined;
      state.selectedChatData = undefined;
      state.selectedChatMessages = [];
    },

    addMessage: (state, action) => {
      console.log("Adding message:", action.payload);

      const data = action.payload;

      if (!data) {
        console.error("Message data is undefined.");
        return;
      }

      let receiver;
      let sender;

      if (state.selectedChatType === "group") {
        receiver = data.receiver;
        sender = data.sender;
      } else {
        receiver = data.receiver ? data.receiver._id : undefined;
        sender = data.sender ? data.sender._id : undefined;
      }

      if (receiver && sender) {
        state.selectedChatMessages.push({
          ...data,
          receiver,
          sender,
        });
      } else {
        console.error("Incomplete message data: missing receiver or sender");
      }
    },
  },
});

export const {
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
  closeChat,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
