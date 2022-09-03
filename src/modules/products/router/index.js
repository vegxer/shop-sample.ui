import ProductList from "@/modules/products/views/ProductList";
import Product from "@/modules/products/views/Product";
import Module from "@/modules/products/Module";

export default {
    path: "/",
    component: Module,
    children: [
        {
            path: "categories/:id/items",
            component: ProductList,
            meta: {
                title: "Товары"
            }
        },
        {
            path: "products/:id",
            component: Product,
            meta: {
                title: "Товар"
            }
        }
    ]
};
