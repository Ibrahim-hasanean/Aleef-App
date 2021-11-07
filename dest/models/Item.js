"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const itemSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number },
    reviews: { type: Number },
    category: { type: mongoose_1.default.Types.ObjectId, ref: "itemsCategory" },
    usersLiked: [{ type: mongoose_1.default.Types.ObjectId, ref: "users" }],
    serialNumber: { type: Number },
    avaliableQuantity: { type: Number },
    allowed: { type: Boolean },
    shippingPrice: { type: Number },
    additionDate: { type: Date },
    soldQuantity: { type: Number },
});
const Item = mongoose_1.default.model("items", itemSchema);
exports.default = Item;
