"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const serviceAccount = require(path_1.default.join(__dirname, "../../fireabase-keys.json"));
const admin = firebase_admin_1.default.initializeApp({ credential: firebase_admin_1.default.credential.cert(serviceAccount) });
exports.default = admin;
