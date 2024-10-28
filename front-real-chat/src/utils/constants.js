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
