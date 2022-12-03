import {CATALOG_AXIOS} from "@/api/axios-config";

export default {
    getPrimal(pageNumber, pageSize) {
        return CATALOG_AXIOS.get('/category/primal', {
            params: {
                pageNumber,
                pageSize
            }
        });
    },
    getSubcategories(categoryId, pageNumber, pageSize) {
        return CATALOG_AXIOS.get(`/category/${categoryId}`, {
            params: {
                pageNumber,
                pageSize
            }
        });
    },
    createSubcategory(data) {
        return CATALOG_AXIOS.post('/category', JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    updateSubcategory(data) {
        return CATALOG_AXIOS.put('/category', JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    setCategoryImage(categoryId, fileBlob) {
        const formData = new FormData();
        formData.set("categoryId", categoryId);
        formData.set("attachment", fileBlob);
        return CATALOG_AXIOS.post('/attachment', formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            }
        });
    },
    deleteImage(categoryId) {
        return CATALOG_AXIOS.delete(`/attachment/category/${categoryId}`);
    },
    deleteCategory(categoryId) {
        return CATALOG_AXIOS.delete(`/category/${categoryId}`);
    }
}