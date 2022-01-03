import admin from "../../config/firebase";
const sendNotifications = async (tokens: string[], data: any) => {
    try {
        let sendNotifications = await admin.messaging().sendMulticast({ tokens, data });
        console.log(sendNotifications.successCount + ' messages were sent successfully');
    } catch (error) {
        console.log(error)
    }
}
export default sendNotifications;