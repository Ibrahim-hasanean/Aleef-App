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
const storage_1 = require("@google-cloud/storage");
const path_1 = __importDefault(require("path"));
const storage = new storage_1.Storage({
    projectId: "spotiphy-clone",
    keyFilename: path_1.default.join(__dirname, "../../../fireabase-keys.json")
});
const bucket = storage.bucket("gs://spotiphy-clone.appspot.com");
const uploadImageToStorage = (file) => {
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
        blobStream.on('error', (error) => {
            reject('Something is wrong! Unable to upload at the moment.');
            console.log(error);
        });
        blobStream.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
            yield fileUpload.makePublic();
            let url = fileUpload.publicUrl();
            resolve(url);
        }));
        blobStream.end(file.buffer);
    });
};
exports.default = uploadImageToStorage;
