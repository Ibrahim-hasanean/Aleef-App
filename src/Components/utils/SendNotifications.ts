import admin from "../../config/firebase";
const sendNotifications = async (tokens: string[], data: any) => {
    try {
        if (tokens.length === 0) {
            return;
        }
        const payload = {
            notification: data
        };

        const options = {
            priority: 'high',
            timeToLive: 60 * 60 * 24, // 1 day
        };

        let sendNotifications = await admin.messaging().sendToDevice(tokens, payload, options);

        console.log(sendNotifications.successCount + ' messages were sent successfully');
    } catch (error: any) {
        console.log(error)
    }
}
export default sendNotifications;