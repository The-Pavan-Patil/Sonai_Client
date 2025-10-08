import dotenv from 'dotenv';
dotenv.config();
const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api",
    timeout: 10000, // 10 seconds timeout
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true, // Include cookies in requests


};

export default API_CONFIG;