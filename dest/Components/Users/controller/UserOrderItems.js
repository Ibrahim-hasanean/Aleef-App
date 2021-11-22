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
exports.updateOrderList = exports.clearOrderItems = exports.getOrderItems = exports.addOrderItems = void 0;
const User_1 = __importDefault(require("../../../models/User"));
const OrderItems_1 = __importDefault(require("../../../models/OrderItems"));
const Item_1 = __importDefault(require("../../../models/Item"));
const addOrderItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let { itemId, count } = req.body;
    const item = yield Item_1.default.findById(itemId);
    if (!item)
        return res.status(200).json({ status: 200, msg: `item with id ${itemId} not found` });
    const orderItem = yield OrderItems_1.default.create({ item: itemId, count });
    user.itemList = [...user.itemList, orderItem._id];
    yield user.save();
    return res.status(201).json({ status: 201, data: { items: orderItem } });
});
exports.addOrderItems = addOrderItems;
const getOrderItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    // .populate({ path: "itemList", populate: "item" });
    let userWithWishList = yield User_1.default.findById(user._id).populate({ path: "itemList", populate: "item" });
    return res.status(200).json({ status: 200, data: { items: userWithWishList.itemList } });
});
exports.getOrderItems = getOrderItems;
const clearOrderItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield req.user.populate("itemList");
    user.itemList = [];
    yield user.save();
    return res.status(200).json({ status: 200, msg: "all item list removed successfully" });
});
exports.clearOrderItems = clearOrderItems;
const updateOrderList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { itemId, count } = req.body;
    let id = req.params.id;
    let user = req.user;
    const item = yield Item_1.default.findById(itemId);
    if (!item)
        return res.status(200).json({ status: 200, msg: `item with id ${itemId} not found` });
    const orderItem = yield OrderItems_1.default.findById(id);
    orderItem.count = count;
    orderItem.item = itemId;
    yield orderItem.save();
    let populatedOrderItem = yield orderItem.populate("item");
    return res.status(201).json({ status: 201, data: { item: populatedOrderItem } });
});
exports.updateOrderList = updateOrderList;
