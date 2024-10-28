import { HOST } from "@/utils/constants.js";
import axios from "axios";

const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
});

export default apiClient;
