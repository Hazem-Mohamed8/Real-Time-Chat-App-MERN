import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChatType: undefined,
  selectedChatData: undefined,
  directContacts: [],
  selectedChatMessages: [],
  groups: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChatType: (state, action) => {
      state.selectedChatType = action.payload;
    },
    setdirectContacts: (state, action) => {
      state.directContacts = action.payload;
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
      const data = action.payload;

      if (!data || (!data.sender && !data.receiver)) {
        console.error("Invalid message data. Payload:", data);
        return;
      }

      let sender = null;
      let receiver = null;

      if (state.selectedChatType === "group") {
        sender = data.sender;
      } else if (state.selectedChatType === "contact") {
        receiver = data.receiver ? data.receiver._id : undefined;
        sender = data.sender ? data.sender._id : undefined;
      }

      if (state.selectedChatType === "contact" && (!receiver || !sender)) {
        console.error(
          "Incomplete message data for contact chat: missing sender or receiver."
        );
        return;
      }

      const newMessage = {
        ...data,
        sender,
        receiver,
      };

      state.selectedChatMessages.push(newMessage);
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
    addGroupInList: (state, action) => {
      const { groupId } = action.payload;

      const index = state.groups.findIndex((group) => group._id === groupId);

      if (index !== -1) {
        const groupData = state.groups[index];
        state.groups.splice(index, 1); // Remove the existing group
        state.groups.unshift(groupData); // Add the group to the beginning
      }
    },
    addDMMessageInList: (state, action) => {
      const { sender, receiver, userId } = action.payload;

      const fromId = sender._id === userId ? receiver._id : sender._id; // Determine the id of opposite side of the chat
      const fromData = sender._id === userId ? receiver : sender;

      const data = state.directContacts.find(
        (contact) => contact._id === fromId
      );

      const contactIndex = state.directContacts.findIndex(
        (contact) => contact._id === fromId
      );

      if (contactIndex !== -1 && contactIndex !== undefined) {
        state.directContacts.splice(contactIndex, 1);
        state.directContacts.unshift(data);
      } else {
        state.directContacts.unshift(fromData);
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
  setdirectContacts,
  setGroups,
  addGroup,
  addGroupInList,
  addDMMessageInList,
} = chatSlice.actions;

export default chatSlice.reducer;
