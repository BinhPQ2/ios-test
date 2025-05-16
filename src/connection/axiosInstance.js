import axios from 'axios';

const baseDomain = import.meta.env.VITE_BACKEND_URL ?? "http://127.0.0.1:10000";
const baseURL = baseDomain + "/api";

export default axios.create({
    baseURL
});