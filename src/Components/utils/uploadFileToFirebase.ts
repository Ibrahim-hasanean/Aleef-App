import { Storage } from "@google-cloud/storage";
import { v4 as uuid } from "uuid";
import path from "path";
const storage = new Storage({
    projectId: "spotiphy-clone",
    keyFilename: path.join(__dirname, "../../fireabase-keys.json")
});

const bucket = storage.bucket("gs://spotiphy-clone.appspot.com");
const uploadImageToStorage = (file: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        let newFileName = `${file.originalname}_${Date.now()}`;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error: any) => {
            reject('Something is wrong! Unable to upload at the moment.');
            console.log(error)
        });

        blobStream.on('finish', async () => {
            await fileUpload.makePublic();
            let url = fileUpload.publicUrl();
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
}

export default uploadImageToStorage;

