import axios from "axios";
import store from "@/store";
import router from "@/router";

const CATALOG_AXIOS = axios.create({
    baseURL: '/api/catalog',
    timeout: 3000
});

CATALOG_AXIOS.interceptors.response.use(response => response, error => {
    if (error.response?.status === 403 && store.getters["user/isAdmin"]) {
        return store.dispatch("user/refreshToken")
            .then(() => {
                return axios.request(error.config);
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    store.commit("unauthorize");
                    if (router.currentRoute.path === '/profile') {
                        return router.push('/categories')
                            .then(() => {
                                return Promise.reject(err);
                            });
                    }
                }
            });
    }
    return Promise.reject(error);
});

export {CATALOG_AXIOS};