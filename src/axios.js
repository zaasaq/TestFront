import axios from "axios";

const instance = axios.create({
  baseURL: "https://testback-z1jb.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default instance;

