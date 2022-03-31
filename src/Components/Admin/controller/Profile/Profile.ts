import { NextFunction, Request, Response } from "express";
import Staff, { StafInterface } from "../../../../models/Staff";
import uploadImageToStorage from "../../../utils/uploadFileToFirebase";


export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    let {
        name,
        email,
        phoneNumber,
        licenseNumber,
        cardNumber,
        staffMemberId
        // muteChat,
        // allowReceivingMessagesOutOfWorksHours,
        // newOrdersNotifications,
        // canceledOrdersNotifications,
        // newReviewsNotifications,
        // itemsAlmostOutOfStockNotification
    } = req.body;
    try {
        let staffMember: StafInterface = req.staff;
        let image = req.file;
        let imageUrl;
        if (image) imageUrl = await uploadImageToStorage(image);
        let isPhoneNumberExist: StafInterface | null = await Staff.findOne({ phoneNumber });
        if (isPhoneNumberExist && String(isPhoneNumberExist?._id) !== String(staffMember._id)) {
            return res.status(409).json({ status: 409, msg: "phone number is used by other staff member" });
        }
        let iEmailExist: StafInterface | null = await Staff.findOne({ email });
        if (iEmailExist && String(iEmailExist?._id) !== String(staffMember._id)) {
            return res.status(409).json({ status: 409, msg: "email is used by other staff member" });
        }
        staffMember.phoneNumber = phoneNumber;
        staffMember.email = email;
        staffMember.name = name;
        staffMember.licenseNumber = licenseNumber || staffMember.licenseNumber;
        staffMember.cardNumber = cardNumber || staffMember.cardNumber;
        staffMember.staffMemberId = staffMemberId || staffMember.staffMemberId;
        staffMember.imageUrl = imageUrl ? imageUrl : staffMember.imageUrl;
        // staffMember.muteChat = muteChat;
        // staffMember.allowReceivingMessagesOutOfWorksHours = allowReceivingMessagesOutOfWorksHours;
        // staffMember.newOrdersNotifications = newOrdersNotifications;
        // staffMember.canceledOrdersNotifications = canceledOrdersNotifications;
        // staffMember.newReviewsNotifications = newReviewsNotifications;
        // staffMember.itemsAlmostOutOfStockNotification = itemsAlmostOutOfStockNotification;
        await staffMember.save();
        return res.status(200).json({ status: 200, msg: "profile updated successfully", data: { staffMember } });

    } catch (error: any) {
        return res.status(400).json({ status: 400, msg: error.message })
    }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    let staffMember: StafInterface = req.staff;
    return res.status(200).json({
        status: 200, data: {
            staffMember
        }
    });
}

export const getProfileNotifications = async (req: Request, res: Response, next: NextFunction) => {
    let staffMember: StafInterface = req.staff;
    return res.status(200).json({
        status: 200, data: {
            settings: {
                muteChat: staffMember.muteChat,
                allowReceivingMessagesOutOfWorksHours: staffMember.allowReceivingMessagesOutOfWorksHours,
                newOrdersNotifications: staffMember.newOrdersNotifications,
                canceledOrdersNotifications: staffMember.canceledOrdersNotifications,
                newReviewsNotifications: staffMember.newReviewsNotifications,
                itemsAlmostOutOfStockNotification: staffMember.itemsAlmostOutOfStockNotification,
                allowReceivingNotificationsOutOfWorksHours: staffMember.allowReceivingNotificationsOutOfWorksHours,
                muteChatNotifications: staffMember.muteChatNotifications,
                newAppointmentsNotifications: staffMember.newAppointmentsNotifications,
                canceledAppointmentsNotifications: staffMember.canceledAppointmentsNotifications,
            }
        }
    });
}

export const setProfileNotifications = async (req: Request, res: Response, next: NextFunction) => {
    let {
        muteChat,
        allowReceivingMessagesOutOfWorksHours,
        newOrdersNotifications,
        canceledOrdersNotifications,
        newReviewsNotifications,
        itemsAlmostOutOfStockNotification,
        allowReceivingNotificationsOutOfWorksHours,
        muteChatNotifications,
        newAppointmentsNotifications,
        canceledAppointmentsNotifications,
    } = req.body;
    let staffMember: StafInterface = req.staff;
    staffMember.muteChat = muteChat;
    staffMember.allowReceivingMessagesOutOfWorksHours = allowReceivingMessagesOutOfWorksHours;
    staffMember.newOrdersNotifications = newOrdersNotifications;
    staffMember.canceledOrdersNotifications = canceledOrdersNotifications;
    staffMember.newReviewsNotifications = newReviewsNotifications;
    staffMember.itemsAlmostOutOfStockNotification = itemsAlmostOutOfStockNotification;
    staffMember.allowReceivingNotificationsOutOfWorksHours = allowReceivingNotificationsOutOfWorksHours;
    staffMember.muteChatNotifications = muteChatNotifications;
    // staffMember.blockChats = blockChats;
    staffMember.newAppointmentsNotifications = newAppointmentsNotifications;
    staffMember.canceledAppointmentsNotifications = canceledAppointmentsNotifications;
    await staffMember.save();
    return res.status(200).json({
        status: 200, data: {
            settings: {
                muteChat: muteChat || staffMember.muteChat,
                allowReceivingMessagesOutOfWorksHours: allowReceivingMessagesOutOfWorksHours || staffMember.allowReceivingMessagesOutOfWorksHours,
                newOrdersNotifications: newOrdersNotifications || staffMember.newOrdersNotifications,
                canceledOrdersNotifications: canceledOrdersNotifications || staffMember.canceledOrdersNotifications,
                newReviewsNotifications: newReviewsNotifications || staffMember.newReviewsNotifications,
                itemsAlmostOutOfStockNotification: itemsAlmostOutOfStockNotification || staffMember.itemsAlmostOutOfStockNotification,
                allowReceivingNotificationsOutOfWorksHours: allowReceivingNotificationsOutOfWorksHours || staffMember.allowReceivingNotificationsOutOfWorksHours,
                muteChatNotifications: muteChatNotifications || staffMember.muteChatNotifications,
                newAppointmentsNotifications: newAppointmentsNotifications || staffMember.newAppointmentsNotifications,
                canceledAppointmentsNotifications: canceledAppointmentsNotifications || canceledAppointmentsNotifications,
            }
        }
    });
}


