import admin from "../../config/firebase";
const sendNotifications = async (tokens: string[], data: any) => {
    try {
        const payload = {
            notification: data
        };

        const options = {
            priority: 'high',
            timeToLive: 60 * 60 * 24, // 1 day
        };

        let sendNotifications = await admin.messaging().sendToDevice(tokens, payload, options);

        // .sendMulticast({data,tokens});
        console.log(tokens)
        console.log(data)
        console.log(sendNotifications)
        console.log(sendNotifications + ' messages were sent successfully');
    } catch (error: any) {
        console.log(error)
    }
}
export default sendNotifications;