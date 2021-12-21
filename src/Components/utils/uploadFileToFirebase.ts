import admin from "../../config/firebase";
import { v4 as uuid } from "uuid";
export default async function (file: any) {
    return new Promise((resolve, reject) => {

        // Format the filename
        const storage = admin.storage().bucket()
        const timestamp = Date.now();
        const name = file.originalname.split(".")[0];
        const type = file.originalname.split(".")[1];
        const fileName = `${name}_${timestamp}.${type}`;

        // Step 1. Create reference for file name in cloud storage 
        const fileUpload = storage.file(fileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });
        blobStream.on('error', (error) => {
            reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            // const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
            // resolve(url);
        });
        blobStream.end(file.buffer);
    })
    // const storageRef = admin.storage().bucket("gs://spotiphy-clone.appspot.com");
    // const storage = await storageRef.upload(path, {
    //     public: true,
    //     destination: `/uploads/hashnode/${filename}`,
    //     metadata: {
    //         firebaseStorageDownloadTokens: uuid()
    //     }
    // });
    // return storage[0].metadata.mediaLink;
}