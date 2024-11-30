export const HOST = import.meta.env.VITE_API_URL;
export const AUTH_ROUTE = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const USERINFO = `${AUTH_ROUTE}/userinfo`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTE}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`;

export const CONTACTS_ROUTE = "api/contacts";
export const SEARCH_CONTACT_ROUTE = `${CONTACTS_ROUTE}/search`;
export const GET_ALL_CONTACT_ROUTE = `${CONTACTS_ROUTE}/get-contacts`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/get-all-contacts`;

export const MESSAGE_ROUTE = "api/messages";
export const GET_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/get-messages`;
export const UPLOAD_FILES_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/upload-files`;

export const GROUPS_ROUTE = "api/groups";
export const CREATE_GROUP_ROUTE = `${GROUPS_ROUTE}/create-group`;
export const GET_USER_GROUPS_ROUTE = `${GROUPS_ROUTE}/get-user-groups`;
export const GET_GROUP_MESSAGES_ROUTE = `${GROUPS_ROUTE}/get-group-messages`;
