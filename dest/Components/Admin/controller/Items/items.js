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
exports.deleteItem = exports.getItemById = exports.getItems = exports.updateItem = exports.addItem = void 0;
const Item_1 = __importDefault(require("../../../../models/Item"));
const uploadFileToFirebase_1 = __importDefault(require("../../../utils/uploadFileToFirebase"));
const addItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, description, price, category, serialNumber, avaliableQuantity, allowed, shippingPrice, additionDate } = req.body;
    let files = req.files;
    let { mainImage, images } = files;
    images = images ? images : [];
    let mainImageUrl = mainImage[0] ? yield (0, uploadFileToFirebase_1.default)(mainImage[0]) : "";
    let uploadImagesFunctions = images.map((image) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, uploadFileToFirebase_1.default)(image); }));
    let imagesUrls = yield Promise.all(uploadImagesFunctions);
    let newItem = yield Item_1.default.create({
        name,
        description,
        price,
        category,
        serialNumber,
        avaliableQuantity,
        allowed,
        shippingPrice,
        additionDate, mainImageUrl, images: imagesUrls
    });
    return res.status(201).json({ status: 201, data: { item: newItem } });
});
exports.addItem = addItem;
const updateItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let itemId = req.params.id;
    let { name, description, price, category, serialNumber, avaliableQuantity, allowed, shippingPrice, additionDate } = req.body;
    let body = {
        name,
        description,
        price,
        category,
        serialNumber,
        avaliableQuantity,
        allowed,
        shippingPrice,
        additionDate
    };
    let files = req.files;
    let { mainImage, images } = files;
    images = images ? images : [];
    let mainImageUrl = mainImage[0] ? yield (0, uploadFileToFirebase_1.default)(mainImage[0]) : null;
    let uploadImagesFunctions = images.map((image) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, uploadFileToFirebase_1.default)(image); }));
    let imagesUrls = yield Promise.all(uploadImagesFunctions);
    if (mainImageUrl)
        body.mainImageUrl = mainImageUrl;
    if (imagesUrls.length > 0)
        body.images = imagesUrls;
    let newItem = yield Item_1.default.findByIdAndUpdate(itemId, body, { new: true });
    return res.status(200).json({ status: 200, data: { item: newItem } });
});
exports.updateItem = updateItem;
const getItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, category, text } = req.query;
    let query = {};
    if (category)
        query.category = category;
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
    let item = yield Item_1.default.findById(itemId);
    return res.status(200).json({ status: 200, data: { item } });
});
exports.getItemById = getItemById;
const deleteItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.id;
    let item = yield Item_1.default.findByIdAndDelete(itemId);
    return res.status(200).json({ status: 200, data: { item } });
});
exports.deleteItem = deleteItem;
