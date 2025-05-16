import instance from "../connection/axiosInstance";
import { GetResponseSchema, PostRequestSchema, PostResponseSchema } from "../validation/shareSchema";
// TODO: integrate reCAPTCHA after completing all functionalities
const resource = "/"
export default {
    async getShareInfo(share_id) {
        let resp = await instance.get(`${resource}${share_id}?captcha_token=test`);
        return await GetResponseSchema.validate(resp.data);
    },
    async createShare(metadata, files) {
        let validated_meta = await PostRequestSchema.validate(metadata);
        const form = new FormData();
        form.append("metadata", JSON.stringify(validated_meta));
        for (let i = 0; i < files.length; i++) {
            form.append(`files_${i}`, files[i]);
        }
        let resp = await instance.post(`${resource}?captcha_token=test`, form);
        return await PostResponseSchema.validate(resp.data);
    },
    async updateShare(share_id, metadata, current_access_code, files) {
        let validated_meta = await PostRequestSchema.validate(metadata);
        const form = new FormData();
        form.append("metadata", JSON.stringify(validated_meta));
        for (let i = 0; i < files.length; i++) {
            form.append(`files_${i}`, files[i]);
        }
        let resp = await instance.post(`${resource}${share_id}?captcha_token=test`, form, {
            headers: {
                Authorization: current_access_code
            }
        });
        return await PostResponseSchema.validate(resp.data);
    }
}