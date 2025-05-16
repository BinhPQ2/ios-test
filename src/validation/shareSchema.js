import { object, string, number, array } from 'yup';

export const UploadFileMetadata = object({
    file_name: string().required(),
    size: number().required(),
    checksum: string().required(),
});

export const PreviewFileMetadata = object({
    file_name: string().required(),
    size: number().required(),
    file_id: number().required(),
});

export const PostRequestSchema = object({
    files_metadata: array(UploadFileMetadata),
    access_code: string(),
    duration_secs: number(),
    message: string(),
});

export const PostResponseSchema = object({
    share_id: string().required(),
    file_ids: array(number()).required(),
});
            
export const GetResponseSchema = object({
    files_metadata: array(PreviewFileMetadata).required(),
    expiry_time_secs: number().required(),
    message: string().required(),
});