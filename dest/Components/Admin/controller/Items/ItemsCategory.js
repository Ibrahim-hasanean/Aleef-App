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
exports.getItemsCategory = exports.deleteCategory = exports.addItemCategory = void 0;
const ItemsCategory_1 = __importDefault(require("../../../../models/ItemsCategory"));
const addItemCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const isExist = yield ItemsCategory_1.default.findOne({ name });
    if (isExist)
        res.status(400).json({ status: 400, msg: "category name is exist" });
    const category = yield ItemsCategory_1.default.create({ name });
    return res.status(201).json({ status: 201, data: { category } });
});
exports.addItemCategory = addItemCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const category = yield ItemsCategory_1.default.findByIdAndDelete(categoryId);
    return res.status(200).json({ status: 200, msg: "category deleted successfully" });
});
exports.deleteCategory = deleteCategory;
const getItemsCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield ItemsCategory_1.default.find({});
    return res.status(200).json({ status: 200, data: { categories } });
});
exports.getItemsCategory = getItemsCategory;
