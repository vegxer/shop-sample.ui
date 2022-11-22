import {AUTH_AXIOS} from "@/modules/user/api/config/axois-config";

export default {
    register(payload) {
        return AUTH_AXIOS.post('/register', JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}