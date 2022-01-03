import firebaseAdmin from "firebase-admin";
import path from "path";
const serviceAccount = require(path.join(__dirname, "../../fireabase-keys.json"));


const admin = firebaseAdmin.initializeApp(serviceAccount);


export default admin;
