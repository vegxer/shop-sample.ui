import loginService from "@/modules/user/login/api/service/login-service";
import authService from "@/modules/user/api/service/auth-service";
import registrationService from "@/modules/user/registration/api/service/registration-service";

export default {
    namespaced: true,
    state: {
        isAuthorized: null,
        id: null,
        role: null,
        login: null,
        email: null
    },
    actions: {
        refreshToken({dispatch, commit}) {
            return authService.refreshToken()
                .then(async response => {
                    commit("setAuthorized", true);
                    await dispatch("getProfile");
                    return Promise.resolve(response);
                })
                .catch(err => {
                    if (err.response?.status === 401) {
                        commit("unauthorize");
                    }
                    throw err;
                });
        },
        register({commit}, payload) {
            commit("unauthorize");
            return registrationService.register(payload);
        },
        login({dispatch, commit}, payload) {
            return loginService.login(payload.login, payload.password)
                .then(async response => {
                    commit("setAuthorized", true);
                    await dispatch("getProfile");
                    return Promise.resolve(response);
                })
                .catch(err => {
                    commit("unauthorize");
                    throw err;
                });
        },
        logout({commit}) {
            return authService.logout()
                .then(() => {
                    commit("unauthorize");
                })
                .catch(err => {
                    if (err.response?.status === 401) {
                        commit("unauthorize");
                    } else {
                        throw err;
                    }
                });
        },
        getProfile({commit, dispatch}) {
            return authService.getUserInfo()
                .then(response => {
                    commit("setUserData", response.data);
                })
                .catch(err => {
                    if (err.response?.status === 401) {
                        dispatch("refreshToken").then(() => {
                            dispatch("getProfile");
                        });
                    } else {
                        throw err;
                    }
                });
        },
        updateProfile({commit, dispatch}, payload) {
            return authService.updateUserInfo(payload)
                .then(response => {
                    commit("setUserData", response.data);
                    return Promise.resolve(response);
                }).catch(error => {
                    if (error.response?.status === 401) {
                        dispatch("refreshToken").then(() => {
                            dispatch("updateProfile", payload);
                        });
                    } else {
                        throw error;
                    }
                })
        }
    },
    mutations: {
        setAuthorized(state, isAuthorized) {
            state.isAuthorized = isAuthorized;
        },
        setRole(state, role) {
            state.role = role;
        },
        setLogin(state, login) {
            state.login = login;
        },
        setEmail(state, email) {
            state.email = email;
        },
        setId(state, id) {
            state.id = id;
        },
        setUserData(state, userData) {
            state.role = userData.role;
            state.login = userData.login;
            state.email = userData.email;
            state.id = userData.id;
        },
        unauthorize(state) {
            state.role = null;
            state.isAuthorized = false;
        }
    },
    getters: {
        isAuthorized(state) {
            return state.isAuthorized;
        },
        isAdmin(state) {
            return state.role === 'ADMIN';
        },
        getLogin(state) {
            return state.login;
        },
        getEmail(state) {
            return state.email;
        },
        getRole(state) {
            return state.role;
        },
        getId(state) {
            return state.id;
        }
    }
};