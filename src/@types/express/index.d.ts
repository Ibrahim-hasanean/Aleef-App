import { Express } from "express";
import { UserInterface } from "../../models/User";
import { StafInterface } from "../../models/Staff";

declare global {
    namespace Express {
        interface Request {
            user: UserInterface
            staff: StafInterface
        }
    }
}
