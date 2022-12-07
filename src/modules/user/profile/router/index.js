import Module from "@/modules/user/profile/Module";
import Profile from "@/modules/user/profile/views/Profile";
import store from "@/store";

export default {
    path: "/profile",
    component: Module,
    beforeEnter: (to, from, next) => {
        if (!store.getters["user/isAuthorized"]) {
            return next('/categories');
        }
        return next();
    },
    children: [
        {
            path: "",
            component: Profile,
            meta: {
                title: "Профиль"
            }
        }
    ]
};
