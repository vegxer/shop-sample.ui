import {CATALOG_AXIOS} from "@/api/axios-config";

export default {
    downloadFile(name) {
        return CATALOG_AXIOS.get(`/attachment/${name}`);
    },
    buildFullAttachmentPath(name) {
        return `${CATALOG_AXIOS.defaults.baseURL}/attachment/${name}`;
    }
};