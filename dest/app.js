"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const celebrate_1 = require("celebrate");
const routes_1 = __importDefault(require("./Components/Users/routes"));
const routes_2 = __importDefault(require("./Components/Admin/routes"));
const app = (0, express_1.default)();
const port = process.env.Port || 3000;
require("./config/mongoose");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res, next) => {
    res.status(200).send("ok");
});
app.use("/users", routes_1.default);
app.use("/admins", routes_2.default);
app.use((0, celebrate_1.errors)());
app.listen(port, () => {
    console.log("listen on", port);
});
exports.default = app;
