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
const sendNotifications = (tokens, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = {
            notification: data
        };
        const options = {
            priority: 'high',
            timeToLive: 60 * 60 * 24, // 1 day
        };
        let sendNotifications = yield firebase_1.default.messaging().sendToDevice(tokens, payload, options);
        // .sendMulticast({data,tokens});
        console.log(tokens);
        console.log(data);
        console.log(sendNotifications);
        console.log(sendNotifications + ' messages were sent successfully');
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = sendNotifications;
