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
exports.getCardInfoById = exports.deleteCardInfo = exports.getCardInfo = exports.addCardInfo = void 0;
const CardsInfo_1 = __importDefault(require("../../../models/CardsInfo"));
const mongoose_1 = __importDefault(require("mongoose"));
const addCardInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { cardNumber, cardHolderName } = req.body;
    let user = req.user;
    let cardInfo = yield CardsInfo_1.default.create({ cardNumber, cardHolderName, user: user._id });
    user.cardsInfo = [...user.cardsInfo, cardInfo._id];
    yield user.save();
    return res.status(201).json({ status: 201, data: { card: cardInfo } });
});
exports.addCardInfo = addCardInfo;
const getCardInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield req.user.populate("cardsInfo");
    return res.status(200).json({ status: 200, data: { card: user.cardsInfo } });
});
exports.getCardInfo = getCardInfo;
const deleteCardInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let user = req.user;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: `there is not card number with id ${id}` });
    }
    const deleteCardNumber = yield CardsInfo_1.default.findByIdAndDelete(id);
    return res.status(200).json({ status: 200, mg: "card info deleted successfully", data: { card: deleteCardNumber } });
});
exports.deleteCardInfo = deleteCardInfo;
const getCardInfoById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let user = req.user;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: `there is not card number with id ${id}` });
    }
    const card = yield CardsInfo_1.default.findById(id);
    return res.status(200).json({ status: 200, data: { card } });
});
exports.getCardInfoById = getCardInfoById;
