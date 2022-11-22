import Module from "@/modules/user/login/Module";
import Login from "@/modules/user/login/views/Login";
import store from "@/store";

export default {
    path: "/login",
    component: Module,
    beforeEnter: (to, from, next) => {
        if (store.getters["user/isAuthorized"]) {
            return next('/profile');
        }
        return next();
    },
    children: [
        {
            path: "",
            component: Login,
            meta: {
                title: "Вход"
            }
        }
    ]
};
