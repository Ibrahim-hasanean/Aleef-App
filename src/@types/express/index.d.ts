import { Express } from "express";
import { UserInterface } from "../../models/User";

declare global {
    namespace Express {
        interface Request {
            user: UserInterface
        }
    }
}
