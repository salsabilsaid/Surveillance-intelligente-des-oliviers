import axios from "axios";
import { BASE_URL } from "../config";

export const getTrees = () => axios.get(`${BASE_URL}/trees`);
export const getHistory = () => axios.get(`${BASE_URL}/history`);
export const getAlerts = () => axios.get(`${BASE_URL}/alerts`);