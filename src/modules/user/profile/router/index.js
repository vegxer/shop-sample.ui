import Module from "@/modules/user/profile/Module";
import Profile from "@/modules/user/profile/views/Profile";

export default {
    path: "/profile",
    component: Module,
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
