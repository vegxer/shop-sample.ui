import Module from "@/modules/user/registration/Module";
import Registration from "@/modules/user/registration/views/Registration";
import store from "@/store";

export default {
    path: "/registration",
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
            component: Registration,
            meta: {
                title: "Регистрация"
            }
        }
    ]
};
