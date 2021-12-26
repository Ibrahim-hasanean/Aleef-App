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
exports.dayHoures = exports.WorkHoures = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dayHouresSchema = new mongoose_1.Schema({
    from: { type: Date, default: "2021-10-25T08:00:00.882Z" },
    to: { type: Date, default: "2021-10-25T18:00:00.882Z" },
    isActive: { type: Boolean, default: true }
});
const weekenDayHouresSchema = new mongoose_1.Schema({
    from: { type: Date, default: "2021-10-25T08:00:00.882Z" },
    to: { type: Date, default: "2021-10-25T18:00:00.882Z" },
    isActive: { type: Boolean, default: false }
});
const workHouresSchema = new mongoose_1.Schema({
    saturday: { type: weekenDayHouresSchema, default: () => ({}) },
    sunday: { type: dayHouresSchema, default: () => ({}) },
    monday: { type: dayHouresSchema, default: () => ({}) },
    tuesday: { type: dayHouresSchema, default: () => ({}) },
    wednesday: { type: dayHouresSchema, default: () => ({}) },
    thursday: { type: dayHouresSchema, default: () => ({}) },
    friday: { type: weekenDayHouresSchema, default: () => ({}) },
});
const staffSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String },
    imageUrl: { type: String },
    cardNumber: { type: String, required: true },
    staffMemberId: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    muteChat: { type: Boolean, default: false },
    allowReceivingMessagesOutOfWorksHours: { type: Boolean, default: false },
    newOrdersNotifications: { type: Boolean, default: false },
    canceledOrdersNotifications: { type: Boolean, default: false },
    newReviewsNotifications: { type: Boolean, default: false },
    itemsAlmostOutOfStockNotification: { type: Boolean, default: false },
    workHoures: {
        type: workHouresSchema,
        default: () => ({})
    }
}, { timestamps: true });
// staffSchema.pre("validate", async function (next) {
//     let staff = this as StafInterface;
//     if (staff.isModified("password")) {
//         let hashPassword = await bcrypt.hash(staff.password, 12);
//         staff.password = hashPassword;
//     }
//     next();
// });
// staffSchema.methods.comaprePassword = async function (password: string): Promise<boolean> {
//     let staff = this as StafInterface;
//     let isEqual = await bcrypt.compare(password, staff.password);
//     return isEqual;
// }
const Staff = mongoose_1.default.model("staff", staffSchema);
exports.WorkHoures = mongoose_1.default.model("workHoures", workHouresSchema);
exports.dayHoures = mongoose_1.default.model("dayHoures", dayHouresSchema);
exports.default = Staff;
