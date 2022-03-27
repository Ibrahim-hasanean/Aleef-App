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
exports.getNotifications = void 0;
const Notifications_1 = __importDefault(require("../../../../models/Notifications"));
const getNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let staffMemeber = req.staff;
    let notifications = yield Notifications_1.default.find({ staffMemeber: staffMemeber._id }).skip(skip).limit(limitNumber);
    let notificationsCount = yield Notifications_1.default.find({ staffMemeber: staffMemeber._id }).count();
    return res.status(200).json({ status: 200, data: { notifications, page: page || 1, limit: limit || 10, notificationsCount } });
});
exports.getNotifications = getNotifications;
