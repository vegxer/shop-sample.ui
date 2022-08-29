import ProductList from "@/modules/products/views/ProductList";
import Product from "@/modules/products/views/Product";
import Module from "@/modules/products/Module";

export default {
    path: "/categories",
    component: Module,
    children: [
        {
            path: "",
            component: ProductList
        },
        {
            path: ":id",
            component: Product
        }
    ]
};
