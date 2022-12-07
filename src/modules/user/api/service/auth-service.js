import {AUTH_AXIOS} from "@/modules/user/api/config/axois-config";

export default {
    getUserInfo() {
        return AUTH_AXIOS.get('/user_info');
    },
    updateUserInfo(data) {
        return AUTH_AXIOS.put('/user_info', JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    refreshToken() {
        return AUTH_AXIOS.put('/refresh');
    },
    logout() {
        return AUTH_AXIOS.post('/logout');
    }
}