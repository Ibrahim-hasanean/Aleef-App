"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const celebrate_1 = require("celebrate");
const routes_1 = __importDefault(require("./Components/Users/routes"));
const routes_2 = __importDefault(require("./Components/Admin/routes"));
const node_cron_1 = __importDefault(require("node-cron"));
const cors_1 = __importDefault(require("cors"));
const CronJob_1 = __importDefault(require("./Components/utils/CronJob"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
require("./config/mongoose");
node_cron_1.default.schedule("* * * * *", CronJob_1.default);
app.use((0, cors_1.default)());
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
