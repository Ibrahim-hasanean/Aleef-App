import firebaseAdmin from "firebase-admin";
const serviceAccount = require("../fireabase-keys.json");

const admin = firebaseAdmin.initializeApp(serviceAccount);


export default admin;
