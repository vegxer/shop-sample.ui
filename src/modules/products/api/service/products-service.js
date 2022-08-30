import {CATALOG_AXIOS} from "@/api/axios-config";

export default {
    getCategoryProducts(id, pageNumber, pageSize, sortBy, direction) {
        return CATALOG_AXIOS.get(`/category/${id}/products`, {
            params: {
                pageNumber,
                pageSize,
                sortBy,
                direction
            }
        })
    },
    getProduct(id) {
        return CATALOG_AXIOS.get(`/product/${id}`);
    }
}