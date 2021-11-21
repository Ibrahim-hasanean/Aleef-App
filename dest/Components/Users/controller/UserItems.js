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
exports.removeAllFromWishList = exports.removeFromWishList = exports.addToWishList = exports.reviewItem = exports.getWishList = exports.getItemById = exports.getItems = void 0;
const Item_1 = __importDefault(require("../../../models/Item"));
const mongoose_1 = __importDefault(require("mongoose"));
const isLikeItem_1 = __importDefault(require("../../utils/isLikeItem"));
const getItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, category, text } = req.query;
    let user = req.user;
    let query = {};
    if (category)
        query.category = category;
    if (text) {
        query.$or = [{ name: { $regex: text, $options: "i" } }, { description: { $regex: text, $options: "i" } }];
    }
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    const items = yield Item_1.default.find(query).skip(skip).limit(limitNumber);
    const checkItems = (0, isLikeItem_1.default)(items, user);
    return res.status(200).json({ status: 200, data: { checkItems } });
});
exports.getItems = getItems;
const getItemById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.id;
    let user = req.user;
    if (!mongoose_1.default.isValidObjectId(itemId)) {
        return res.status(200).json({ status: 200, data: { item: null } });
    }
    let item = yield Item_1.default.findById(itemId);
    if (item) {
        let isLikeItem = user.wishList.some(x => x.toString() === String(item._id));
        item = Object.assign(Object.assign({}, item._doc), { isLikeItem });
    }
    return res.status(200).json({ status: 200, data: { item } });
});
exports.getItemById = getItemById;
const getWishList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield req.user.populate("wishList");
    return res.status(200).json({ status: 200, data: { items: user.wishList } });
});
exports.getWishList = getWishList;
const reviewItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.id;
    const { rate } = req.body;
    if (!mongoose_1.default.isValidObjectId(itemId)) {
        return res.status(400).json({ status: 400, msg: "item not found" });
    }
    const item = yield Item_1.default.findById(itemId);
    if (!item) {
        return res.status(400).json({ status: 400, msg: "item not found" });
    }
    item.numberOfReviews = item.numberOfReviews + 1;
    item.sumOfReviews = item.sumOfReviews + Number(rate);
    item.review = item.sumOfReviews / item.numberOfReviews;
    yield item.save();
    return res.status(200).json({ status: 200, msg: "review successfully" });
});
exports.reviewItem = reviewItem;
const addToWishList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.id;
        const user = req.user;
        if (!mongoose_1.default.isValidObjectId(itemId)) {
            return res.status(400).json({ status: 400, msg: "item not found" });
        }
        const item = yield Item_1.default.findById(itemId);
        if (!item) {
            return res.status(400).json({ status: 400, msg: "item not found" });
        }
        let usersLikedSet = new Set(item.usersLiked.map(x => String(x)));
        usersLikedSet.add(String(user._id));
        item.usersLiked = [...usersLikedSet];
        let wishListSet = new Set(user.wishList.map(x => String(x)));
        wishListSet.add(String(item._id));
        user.wishList = [...wishListSet];
        yield item.save();
        yield user.save();
        return res.status(200).json({ status: 200, data: { item } });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.addToWishList = addToWishList;
const removeFromWishList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.id;
    const user = req.user;
    if (!mongoose_1.default.isValidObjectId(itemId)) {
        return res.status(400).json({ status: 400, msg: "item not found" });
    }
    const item = yield Item_1.default.findById(itemId);
    if (!item) {
        return res.status(400).json({ status: 400, msg: "item not found" });
    }
    item.usersLiked = item.usersLiked.filter(userId => String(userId) != String(user._id));
    let wishList = user.wishList;
    user.wishList = wishList.filter((x) => String(x) != itemId);
    yield item.save();
    yield user.save();
    return res.status(200).json({ status: 200, data: { item } });
});
exports.removeFromWishList = removeFromWishList;
const removeAllFromWishList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    user.wishList = [];
    yield user.save();
    return res.status(200).json({ status: 200, msg: "all items removed successfully from wishlist" });
});
exports.removeAllFromWishList = removeAllFromWishList;
