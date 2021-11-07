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
exports.removeFromWishList = exports.addToWishList = exports.getWishList = exports.getItemById = exports.getItems = void 0;
const Item_1 = __importDefault(require("../../../models/Item"));
const getItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, categoryId, text } = req.query;
    let query = {};
    if (categoryId)
        query.category = categoryId;
    if (text) {
        query.$or = [{ name: { $regex: text, $options: "i" } }, { description: { $regex: text, $options: "i" } }];
    }
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    const items = yield Item_1.default.find(query).skip(skip).limit(limitNumber);
    return res.status(200).json({ status: 200, data: { items } });
});
exports.getItems = getItems;
const getItemById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.id;
    const item = yield Item_1.default.findById(itemId);
    return res.status(200).json({ status: 200, data: { item } });
});
exports.getItemById = getItemById;
const getWishList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield req.user.populate("wishList");
    return res.status(200).json({ status: 200, data: { items: user.wishList } });
});
exports.getWishList = getWishList;
const addToWishList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.id;
    const user = req.user;
    const items = yield Item_1.default.findById(itemId);
    let usersLikedSet = new Set(items.usersLiked.map(x => String(x)));
    usersLikedSet.add(String(user._id));
    items.usersLiked = [...usersLikedSet];
    let wishListSet = new Set(user.wishList.map(x => String(x)));
    wishListSet.add(String(items._id));
    user.wishList = [...wishListSet];
    yield items.save();
    yield user.save();
    return res.status(200).json({ status: 200, data: { items } });
});
exports.addToWishList = addToWishList;
const removeFromWishList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.id;
    const user = req.user;
    const items = yield Item_1.default.findById(itemId);
    items.usersLiked = items.usersLiked.filter(userId => String(userId) != String(user._id));
    let wishList = user.wishList;
    user.wishList = wishList.filter((x) => String(x) != itemId);
    yield items.save();
    yield user.save();
    return res.status(200).json({ status: 200, data: { items } });
});
exports.removeFromWishList = removeFromWishList;
