import Module from "@/modules/products/Module";
import CategoryList from "@/modules/categories/views/CategoryList";

export default {
    path: "/categories",
    component: Module,
    children: [
        {
            path: ":id",
            component: CategoryList,
            meta: {
                title: "Категории"
            }
        },
        {
            path: "",
            component: CategoryList,
            meta: {
                title: "Категории"
            }
        }
    ]
};
