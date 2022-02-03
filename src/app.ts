import express, { Request, Response, NextFunction } from "express";
import { errors } from "celebrate";
import userRoutes from "./Components/Users/routes";
import adminRoutes from "./Components/Admin/routes";
import cron from "node-cron";
import cors from "cors";
import appointmentsNotifications from "./Components/utils/CronJob";
import * as ioServer from "socket.io";
import http from "http";
const app = express();
const server = http.createServer(app);
const io = new ioServer.Server(server);
const port = process.env.PORT || 3000;
import socketIoEvents from "./socketIoEvents/socketIoEvents"
require("./config/mongoose");

cron.schedule("* * * * *", appointmentsNotifications);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("ok");
});

app.use("/users", userRoutes);
app.use("/admins", adminRoutes);


app.use(errors());

server.listen(port, () => {
    console.log("listen on", port);
});

socketIoEvents(io);


export default app;

