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
const Item_1 = __importDefault(require("../../models/Item"));
function caculateItemsPrice(orderItems) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let shippingCost = 0;
        let itemsCost = 0;
        for (let i = 0; i < orderItems.length; i++) {
            const orderItem = orderItems[i];
            let itemId = orderItem.item;
            const item = yield Item_1.default.findById(itemId);
            if (!item)
                throw new Error(`can not pay items, item with id  ${itemId} not found`);
            if ((item === null || item === void 0 ? void 0 : item.avaliableQuantity) && item.avaliableQuantity <= 0)
                throw new Error(`this item ${itemId} is out of stock`);
            if ((item === null || item === void 0 ? void 0 : item.avaliableQuantity) && item.avaliableQuantity < orderItem.count)
                throw new Error(`this item is out of stock`);
            let itemShippingCost = Number(item.shippingPrice) * Number(orderItem.count);
            let itemCost = Number(item.price) * Number(orderItem.count);
            shippingCost = itemShippingCost + shippingCost;
            itemsCost = itemCost + itemsCost;
            item.avaliableQuantity = ((_a = item === null || item === void 0 ? void 0 : item.avaliableQuantity) !== null && _a !== void 0 ? _a : 0) - (1 * orderItem.count);
            item.soldQuantity = item.soldQuantity + (1 * orderItem.count);
            yield item.save();
        }
        ;
        return { shippingCost, itemsCost, totalCost: itemsCost + shippingCost };
    });
}
exports.default = caculateItemsPrice;
