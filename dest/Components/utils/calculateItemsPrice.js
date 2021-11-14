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
    return __awaiter(this, void 0, void 0, function* () {
        let shippingCost = 0;
        let itemsCost = 0;
        for (let i = 0; i < orderItems.length; i++) {
            const orderItem = orderItems[i];
            let itemId = orderItem.item;
            const item = yield Item_1.default.findById(itemId);
            if (!item)
                throw new Error(`can not pay items, item with id  ${itemId} not found`);
            let itemShippingCost = Number(item.shippingPrice) * Number(orderItem.count);
            let itemCost = Number(item.price) * Number(orderItem.count);
            shippingCost = itemShippingCost + shippingCost;
            itemsCost = itemCost + itemsCost;
        }
        ;
        return { shippingCost, itemsCost, totalCost: itemsCost + shippingCost };
    });
}
exports.default = caculateItemsPrice;
