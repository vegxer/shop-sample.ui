import {CATALOG_AXIOS} from "@/api/axios-config";

export default {
    downloadFile(name) {
        return CATALOG_AXIOS.get(`/attachment/${name}`);
    },
    buildFullAttachmentPath(name) {
        return `${process.env.VUE_APP_CATALOG_URL}attachment/${name}`;
    }
};