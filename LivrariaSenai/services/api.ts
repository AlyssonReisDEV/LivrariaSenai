import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.18.16:3000', // seu IP local
  timeout: 10000, // tempo limite opcional (10s)
});

export default api;
