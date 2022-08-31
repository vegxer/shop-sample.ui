import ProductList from "@/modules/products/views/ProductList";
import Product from "@/modules/products/views/Product";
import Module from "@/modules/products/Module";

export default {
    path: "/",
    component: Module,
    children: [
        {
            path: "categories/:id/products",
            component: ProductList
        },
        {
            path: "products/:id",
            component: Product
        }
    ]
};
