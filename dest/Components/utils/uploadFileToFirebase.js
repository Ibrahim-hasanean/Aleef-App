"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../../config/firebase"));
function default_1(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Format the filename
            const storage = firebase_1.default.storage().bucket();
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
        });
        // const storageRef = admin.storage().bucket("gs://spotiphy-clone.appspot.com");
        // const storage = await storageRef.upload(path, {
        //     public: true,
        //     destination: `/uploads/hashnode/${filename}`,
        //     metadata: {
        //         firebaseStorageDownloadTokens: uuid()
        //     }
        // });
        // return storage[0].metadata.mediaLink;
    });
}
exports.default = default_1;
