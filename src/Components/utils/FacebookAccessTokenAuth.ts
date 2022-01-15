import axios from "axios";
const facebookAccessTokenAuth = async (access_token: string) => {
    try {
        const getAccessTokenData = await axios.get(`https://graph.facebook.com/me?access_token=${access_token}&fields=id,email,name,gender,picture`);
        return getAccessTokenData.data
    } catch (error: any) {
        return Promise.reject(error.message)
    }
}
export default facebookAccessTokenAuth;
// facebookAccessTokenAuth("EAADC31V5DM4BAG1EEqMLhUS2ZALbtrikptLfcHbsgRzZAr088T0Uaeg2Mvh9uMPZCsi15Fzsx27ztmVJ4x1iMc1r6aGWqW8uNqceMd9YOisBEBrezZCoisYACEfo6melFgh2HhGdTY3NgzP2EtYq3MxZAr3YdpIve0gniRU4joHZAowmnEehGehLBN3wb8sGFeZAIRlNArSNwREudFv1bFqr08KZB0hjR2axiWBS1P26JAZDZD")