import axios from "axios";

const http = axios.create({
  baseURL: "http://laravel.pv016.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;
