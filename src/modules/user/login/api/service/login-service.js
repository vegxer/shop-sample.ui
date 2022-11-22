import {AUTH_AXIOS} from "@/modules/user/api/config/axois-config";

export default {
    login(username, password) {
        return AUTH_AXIOS.post('/login', {}, {
            headers: {
                'Authorization': 'Basic ' + btoa(`${username}:${password}`)
            }
        });
    }
};