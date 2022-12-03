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
    },
    deleteProduct(id) {
        return CATALOG_AXIOS.delete(`/product/${id}`);
    },
    updateProduct(data) {
        return CATALOG_AXIOS.put('/product', JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    uploadFile(fileBlob, productId) {
        const formData = new FormData();
        formData.set("productId", productId);
        formData.set("attachment", fileBlob);
        return CATALOG_AXIOS.post('/attachment', formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            }
        });
    },
    deleteFile(id, filename) {
        return CATALOG_AXIOS.delete(`/attachment/product/${id}`, {
            params: {
                filename
            }
        });
    }
}