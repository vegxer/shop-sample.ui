import {CATALOG_AXIOS} from "@/api/axios-config";

export default {
    getPrimal(pageNumber, pageSize) {
        return CATALOG_AXIOS.get('/category/primal', {
            params: {
                pageNumber,
                pageSize
            }
        })
    },
    getSubcategories(categoryId, pageNumber, pageSize) {
        return CATALOG_AXIOS.get(`/category/${categoryId}`, {
            params: {
                pageNumber,
                pageSize
            }
        })
    }
}