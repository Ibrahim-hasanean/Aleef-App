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
const petsSchema = new mongoose_1.Schema({
    name: { type: String },
    serialNumber: { type: String },
    age: { type: Number },
    type: { type: mongoose_1.default.Types.ObjectId, ref: "petsTypes" },
    imageUrl: { type: String },
    user: { type: mongoose_1.default.Types.ObjectId, ref: "users" },
    appointments: [{ type: mongoose_1.default.Types.ObjectId, ref: "appointments" }],
    breed: { type: mongoose_1.default.Types.ObjectId, ref: "breeds" },
    vaccinations: [{ type: mongoose_1.default.Types.ObjectId, ref: "vaccination" }],
    medacins: [{ type: mongoose_1.default.Types.ObjectId, ref: "medicins" }],
    gender: { type: String },
    microshipNumber: { type: Number },
    weight: { type: Number },
    notes: { type: String, default: "" },
    // lastCheckUp: { type: Date }
    nutried: { type: Boolean },
    duerming: { type: Boolean }
});
const Pets = mongoose_1.default.model("pets", petsSchema);
exports.default = Pets;
