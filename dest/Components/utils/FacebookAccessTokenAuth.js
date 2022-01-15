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
const axios_1 = __importDefault(require("axios"));
const facebookAccessTokenAuth = (access_token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAccessTokenData = yield axios_1.default.get(`https://graph.facebook.com/me?access_token=${access_token}&fields=id,email,name,gender,picture`);
        return getAccessTokenData.data;
    }
    catch (error) {
        return Promise.reject(error.message);
    }
});
exports.default = facebookAccessTokenAuth;
// facebookAccessTokenAuth("EAADC31V5DM4BAG1EEqMLhUS2ZALbtrikptLfcHbsgRzZAr088T0Uaeg2Mvh9uMPZCsi15Fzsx27ztmVJ4x1iMc1r6aGWqW8uNqceMd9YOisBEBrezZCoisYACEfo6melFgh2HhGdTY3NgzP2EtYq3MxZAr3YdpIve0gniRU4joHZAowmnEehGehLBN3wb8sGFeZAIRlNArSNwREudFv1bFqr08KZB0hjR2axiWBS1P26JAZDZD")
