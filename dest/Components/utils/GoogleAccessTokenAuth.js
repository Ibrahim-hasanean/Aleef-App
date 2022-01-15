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
const GoogleAccessTokenAuth = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAccessTokenData = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
        return getAccessTokenData.data;
    }
    catch (error) {
        return Promise.reject(error.message);
    }
});
exports.default = GoogleAccessTokenAuth;
// GoogleAccessTokenAuth("ya29.A0ARrdaM-T3tcySsFwB8EdmSh9glw_HXdUy5TK9jhlDUrYFKOxlubpMIPmMBAQ-pb51AhK_pA5VDNvx-t5Kn9IjJnHu87dIfn4SSsAHPAJ9JuYrsPYAvszsE1DKxd82EAxLW2ESRuRRJlyH0GZ-5eBh0wF5jb6QA")
