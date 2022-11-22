import axios from "axios";

const AUTH_AXIOS = axios.create({
    baseURL: '/api/auth',
    timeout: 3000
});

export {AUTH_AXIOS};