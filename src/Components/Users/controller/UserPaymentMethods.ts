import { NextFunction, Request, Response } from "express";
import Payment, { PaymentInterFace } from "../../../models/Payment";
import { paymentMethod, cancelPayment } from "../../utils/paymentMethod";

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { totalPrice, currency } = req.body;
        // let user = req.user;
        // let paymentIntent = await paymentMethod(totalPrice, currency, "aleef payment");
        // const payment: PaymentInterFace = await Payment.create({
        //     totalAmount: totalPrice,
        //     paymentAmmount: totalPrice,
        //     paymentType: "visa",
        //     user: user._id,
        //     paymentIntentId: paymentIntent.id
        // });
        // return res.status(200).json({ status: 200, data: { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id } });
    } catch (error: any) {
        return res.status(400).json({ status: 400, msg: error.message ?? error });
    }

}