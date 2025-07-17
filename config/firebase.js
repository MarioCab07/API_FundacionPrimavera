const admin = require('firebase-admin');
const path = require('path');
const bucketName = process.env.BUCKET;

const serviceAccount = require(path.join(__dirname,'serviceAccountKey.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucketName
});

module.exports = admin.storage().bucket();