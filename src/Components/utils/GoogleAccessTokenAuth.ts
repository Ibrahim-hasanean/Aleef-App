import axios from "axios";
const GoogleAccessTokenAuth = async (accessToken: string) => {
    try {
        const getAccessTokenData = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
        return getAccessTokenData.data;
    } catch (error: any) {
        return Promise.reject(error.message)
    }
}
export default GoogleAccessTokenAuth;
// GoogleAccessTokenAuth("ya29.A0ARrdaM-T3tcySsFwB8EdmSh9glw_HXdUy5TK9jhlDUrYFKOxlubpMIPmMBAQ-pb51AhK_pA5VDNvx-t5Kn9IjJnHu87dIfn4SSsAHPAJ9JuYrsPYAvszsE1DKxd82EAxLW2ESRuRRJlyH0GZ-5eBh0wF5jb6QA")