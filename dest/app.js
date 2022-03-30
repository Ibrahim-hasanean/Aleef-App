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
const ioServer = __importStar(require("socket.io"));
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new ioServer.Server(server, {
    cors: { origin: "*" },
    // origin: "https://example.com",
    // methods: ["GET", "POST"],
    // allowedHeaders: ["userToken", "staffToken"],
});
const port = process.env.PORT || 3000;
const socketIoEvents_1 = __importDefault(require("./socketIoEvents/socketIoEvents"));
require("./config/mongoose");
app.use((0, cors_1.default)());
node_cron_1.default.schedule("* * * * *", CronJob_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res, next) => {
    res.status(200).send("ok");
});
app.use("/users", routes_1.default);
app.use("/admins", routes_2.default);
app.use((0, celebrate_1.errors)());
server.listen(port, () => {
    console.log("listen on", port);
});
(0, socketIoEvents_1.default)(io);
exports.default = app;
