import express, { Request, Response, NextFunction } from "express";
import { errors } from "celebrate";
import userRoutes from "./Components/Users/routes";
import adminRoutes from "./Components/Admin/routes";
const app = express();
const port = process.env.Port || 3000;
require("./config/mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("ok");
});

app.use("/users", userRoutes);
app.use("/admins", adminRoutes);


app.use(errors());

app.listen(port, () => {
    console.log("listen on", port);
})

export default app;

