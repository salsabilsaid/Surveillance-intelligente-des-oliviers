import axios from "axios";
import { BASE_URL } from "../config";

export const getTrees = () => axios.get(`${BASE_URL}/api/trees`);
export const getHistory = () => axios.get(`${BASE_URL}/api/history`);
export const getAlerts = () => axios.get(`${BASE_URL}/api/alerts`);

export const loginRequest = (email, motDePasse) =>
  axios.post(`${BASE_URL}/api/auth/login`, { email, motDePasse });

export const signupRequest = (email, motDePasse, nom) =>
  axios.post(`${BASE_URL}/api/auth/signup`, { email, motDePasse, nom });

export const setIrrigation = (nodeId, action, duree) =>
  axios.post(`${BASE_URL}/api/irrigation/${nodeId}`, { action, duree });