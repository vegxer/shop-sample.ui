import axios from "axios";

const CATALOG_AXIOS = axios.create({
    baseURL: process.env.VUE_APP_CATALOG_URL,
    timeout: 3000
});

export {CATALOG_AXIOS};