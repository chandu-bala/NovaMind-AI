const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "../service-account.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

console.log("✅ Firestore connected successfully");

module.exports = { db };
