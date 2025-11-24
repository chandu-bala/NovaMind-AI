// // backend/config/firestore.js
// const admin = require("firebase-admin");

// let app;
// if (!admin.apps.length) {
//   // If GOOGLE_APPLICATION_CREDENTIALS is set, admin will pick it automatically.
//   app = admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//   });
// } else {
//   app = admin.app();
// }

// const db = admin.firestore();

// module.exports = {
//   db,
// };


const admin = require("firebase-admin");
const path = require("path");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      require(path.join(__dirname, "../service-account.json"))
    ),
  });
}

const db = admin.firestore();

module.exports = { db };

