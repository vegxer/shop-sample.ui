import axios from "axios";

const CATALOG_AXIOS = axios.create({
    baseURL: '/api/catalog',
    timeout: 3000
});

export {CATALOG_AXIOS};