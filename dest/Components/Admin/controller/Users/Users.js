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
exports.updateUserWithPets = exports.addNewUserWithPets = exports.deleteUser = exports.updateUser = exports.addNewUser = exports.suspendUser = exports.getUserById = exports.getUsers = void 0;
const User_1 = __importDefault(require("../../../../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const uploadFileToFirebase_1 = __importDefault(require("../../../utils/uploadFileToFirebase"));
const Appointments_1 = __importDefault(require("../../../../models/Appointments"));
const Pets_1 = __importDefault(require("../../../../models/Pets"));
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit, text, phoneNumber } = req.query;
        const limitNumber = Number(limit) || 10;
        const skip = (Number(page || 1) - 1) * limitNumber;
        let query = {};
        if (text)
            query.fullName = { $regex: text, $options: "i" };
        if (phoneNumber)
            query.phoneNumber = phoneNumber;
        const users = yield User_1.default.find(query)
            .sort({ createdAt: "desc" })
            .skip(skip)
            .limit(limitNumber)
            .select(['fullName', 'phoneNumber', 'email', 'isSuspend', 'imageUrl'])
            .populate({ path: "pets", select: ['name', 'age', 'serialNumber', 'imageUrl', 'imageUrl'] });
        var results = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            let lastUsetVisit = yield Appointments_1.default.find({ user: user._id }).sort({ appointmentDate: "desc" }).limit(1);
            return Object.assign({ lastVisit: lastUsetVisit[0] ? lastUsetVisit[0].appointmentDate : "" }, user.toJSON());
        })));
        const usersCount = yield User_1.default.find(query).count();
        // let reponseUsers = users.map(async (user: UserInterface) => {
        //     let lastUsetVisit = await Appointments.find({ user: user._id }).sort({ appointmentDate: "desc" }).limit(1);
        //     return { ...user.toJSON(), lastVisit: lastUsetVisit[0] ? lastUsetVisit[0].appointmentDate : "" }
        // })
        return res.status(200).json({ status: 200, data: { users: results, page: page || 1, limit: limit || 10, usersCount } });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, msg: error.message });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(200).json({ status: 200, data: { user: null } });
    }
    let user = yield User_1.default.findById(id)
        .select(['fullName', 'phoneNumber', 'email', 'isSuspend', 'imageUrl'])
        .populate({ path: "pets", select: ['name', 'age', 'serialNumber', 'imageUrl', 'imageUrl'] });
    if (!user)
        return res.status(200).json({ status: 200, data: { user } });
    let lastUsetVisit = yield Appointments_1.default.find({ user: user === null || user === void 0 ? void 0 : user._id }).sort({ appointmentDate: "desc" }).limit(1);
    let userObject = Object.assign({ lastVisit: lastUsetVisit[0] ? lastUsetVisit[0].appointmentDate : "" }, user.toJSON());
    return res.status(200).json({ status: 200, data: { user: userObject } });
});
exports.getUserById = getUserById;
const suspendUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: "use not found" });
    }
    let user = yield User_1.default.findById(id);
    if (!user)
        return res.status(400).json({ status: 400, msg: "use not found" });
    user.isSuspend = !user.isSuspend;
    yield user.save();
    return res.status(200).json({ status: 200, msg: "toggle suspended successfully" });
});
exports.suspendUser = suspendUser;
const addNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { fullName, email, phoneNumber, password } = req.body;
    let image = req.file;
    let imageUrl = image ? yield (0, uploadFileToFirebase_1.default)(image) : "";
    const isPhoneNumberExist = yield User_1.default.findOne({ phoneNumber });
    if (isPhoneNumberExist)
        return res.status(409).json({ status: 409, msg: "phone number is used by other user" });
    if (email) {
        const isEmailExist = yield User_1.default.findOne({ email });
        if (isEmailExist)
            return res.status(409).json({ status: 409, msg: "email is used by other user" });
    }
    let newUser = yield User_1.default.create({ fullName, phoneNumber, password, email, imageUrl });
    return res.status(201).json({ status: 201, msg: "user created successfully", data: { user: newUser } });
});
exports.addNewUser = addNewUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, phoneNumber, email } = req.body;
    let image = req.file;
    let imageUrl;
    if (image)
        imageUrl = yield (0, uploadFileToFirebase_1.default)(image);
    let userId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(userId)) {
        return res.status(400).json({ status: 400, msg: "user not found" });
    }
    const user = yield User_1.default.findById(userId);
    if (!user)
        return res.status(400).json({ status: 400, msg: "user not found" });
    const isPhoneNumberExist = yield User_1.default.findOne({ phoneNumber });
    if (isPhoneNumberExist && (isPhoneNumberExist === null || isPhoneNumberExist === void 0 ? void 0 : isPhoneNumberExist._id.toString()) !== user._id.toString()) {
        return res.status(409).json({ status: 409, msg: "phone number is used by other user" });
    }
    const isEmailExist = yield User_1.default.findOne({ email });
    if (isEmailExist && (isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist._id.toString()) !== user._id.toString()) {
        return res.status(409).json({ status: 409, msg: "email is used by other user" });
    }
    user.fullName = fullName;
    user.email = email;
    user.imageUrl = imageUrl ? imageUrl : user.imageUrl;
    user.phoneNumber = phoneNumber;
    yield user.save();
    res.status(200).json({
        status: 200, data: {
            user
        }
    });
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let deleteUser = yield User_1.default.findByIdAndDelete(id);
    return res.status(200).json({ status: 200, msg: "user deleted successfully" });
});
exports.deleteUser = deleteUser;
const addNewUserWithPets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { user, pets } = req.body;
    let images = req.files;
    let image = images["image"];
    let petsImages = images["petsImages"];
    console.log(user);
    console.log(pets);
    console.log(image);
    console.log(petsImages);
    user = JSON.parse(user);
    let { fullName, email, phoneNumber, password } = user;
    let imageUrl = image ? yield (0, uploadFileToFirebase_1.default)(image) : "";
    const isPhoneNumberExist = yield User_1.default.findOne({ phoneNumber });
    if (isPhoneNumberExist)
        return res.status(409).json({ status: 409, msg: "phone number is used by other user" });
    if (email) {
        const isEmailExist = yield User_1.default.findOne({ email });
        if (isEmailExist)
            return res.status(409).json({ status: 409, msg: "email is used by other user" });
    }
    // let newUser = await User.create({ fullName, phoneNumber, password, email, imageUrl });
    let newUser = new User_1.default({ fullName, phoneNumber, password, email, imageUrl });
    // let addPetsFunction = [];
    try {
        // for (let i = 0; i < pets.length; i++) {
        //     let pet = JSON.parse(pets[i]);
        //     // await addNewPetToUser(pet.name, pet.serialNumber, pet.age, pet.typeId, pet.breedId, pet.gender, newUser._id, petsImages[i]);
        //     uploadImagesFunctions.push(async () => await addNewPetToUser(pet.name, pet.serialNumber, pet.age, pet.typeId, pet.breedId, pet.gender, newUser._id, petsImages[i]));
        // }
        let addPetsFunction = (pets || []).map((petStringify, i) => __awaiter(void 0, void 0, void 0, function* () {
            let pet = JSON.parse(petStringify);
            return yield addNewPetToUser(pet.name, pet.serialNumber, pet.age, pet.typeId, pet.breedId, pet.gender, newUser._id, petsImages[i]);
        }));
        let addedPets = yield Promise.all(addPetsFunction);
        let petsIds = addedPets.map((x) => x._id);
        newUser.pets = addedPets;
    }
    catch (error) {
        return res.status(400).json({ status: 400, msg: error.message });
    }
    yield newUser.save();
    return res.status(201).json({ status: 201, msg: "user created successfully", data: { user: newUser } });
});
exports.addNewUserWithPets = addNewUserWithPets;
const updateUserWithPets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        let { user, pets } = req.body;
        let userId = req.params.id;
        let images = req.files;
        let image = images["image"];
        let petsImages = images["petsImages"];
        user = JSON.parse(user);
        console.log(req.body);
        console.log(req.files);
        let { fullName, email, phoneNumber } = user;
        let imageUrl = image ? yield (0, uploadFileToFirebase_1.default)(image) : "";
        if (!mongoose_1.default.isValidObjectId(userId)) {
            return res.status(400).json({ status: 400, msg: "user not found" });
        }
        const existUser = yield User_1.default.findById(userId).populate("pets");
        if (!user)
            return res.status(400).json({ status: 400, msg: "user not found" });
        const isPhoneNumberExist = yield User_1.default.findOne({ phoneNumber });
        if (isPhoneNumberExist && ((_a = isPhoneNumberExist === null || isPhoneNumberExist === void 0 ? void 0 : isPhoneNumberExist._id) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = existUser._id) === null || _b === void 0 ? void 0 : _b.toString())) {
            return res.status(409).json({ status: 409, msg: "phone number is used by other user" });
        }
        const isEmailExist = yield User_1.default.findOne({ email });
        if (isEmailExist && ((_c = isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist._id) === null || _c === void 0 ? void 0 : _c.toString()) !== ((_d = existUser._id) === null || _d === void 0 ? void 0 : _d.toString())) {
            return res.status(409).json({ status: 409, msg: "email is used by other user" });
        }
        existUser.fullName = fullName;
        existUser.email = email;
        existUser.imageUrl = imageUrl ? imageUrl : existUser.imageUrl;
        existUser.phoneNumber = phoneNumber;
        let addPetsFunction = (pets || []).map((petStringify, i) => __awaiter(void 0, void 0, void 0, function* () {
            let pet = JSON.parse(petStringify);
            return yield addNewPetToUser(pet.name, pet.serialNumber, pet.age, pet.typeId, pet.breedId, pet.gender, existUser._id, petsImages[i]);
        }));
        let addedPets = yield Promise.all(addPetsFunction);
        let petsIds = addedPets.map((x) => x._id);
        let existingPets = existUser.pets;
        existUser.pets = [...existingPets, ...addedPets];
        yield existUser.save();
        return res.status(200).json({ status: 200, msg: "user created successfully", data: { user: existUser } });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ status: 400, msg: error.message });
    }
});
exports.updateUserWithPets = updateUserWithPets;
const addNewPetToUser = (name, serialNumber, age, typeId, breedId, gender, userId, image) => __awaiter(void 0, void 0, void 0, function* () {
    let imageUrl = image ? yield (0, uploadFileToFirebase_1.default)(image) : "";
    let pet = yield Pets_1.default.create({ user: userId, imageUrl, name, serialNumber, age, type: typeId, breed: breedId, gender });
    // user.pets = [...user.pets, pet._id];
    // await user.save();
    return pet;
});
