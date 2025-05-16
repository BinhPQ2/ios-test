import { parseFile } from "./parseFile";
import { Crc32c } from '@aws-crypto/crc32c';
import { UploadFileMetadata } from "../validation/shareSchema";
import { Base64 } from 'js-base64';

function convertUint32ToBase64(val) {
    const buffer = new ArrayBuffer(4);
    const view   = new DataView(buffer);
    view.setUint32(0, val, false);
    return Base64.fromUint8Array(new Uint8Array(buffer));
}
  
export const analyzeFile = async (file) => {
    return new Promise((resolve) => {
        const crc32Digest = new Crc32c();
        let totalLen = 0;
        parseFile(file, {
          binary: true,
          chunkSize: 64 * 1024,
          onChunkRead: (chunk) => {
            crc32Digest.update(new Uint8Array(chunk));
            totalLen += chunk.byteLength;
          },
          onChunkError: (e) => { console.log(e); },
          success: (file) => {
            resolve(UploadFileMetadata.cast({
              file_name: file.name,
              size: totalLen,
              checksum: convertUint32ToBase64(crc32Digest.digest()),
            }))
          } 
        });
    });
  }
