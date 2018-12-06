'use strict';

const functions = require('firebase-functions');
const sharp = require('sharp');
const path = require('path');
const os = require('os');
const fs = require('fs');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

var serviceAccount = require('./service_key/closetchartapi-firebase-adminsdk-u8vlr-a5bd8fe8ef.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://closetchartapi.firebaseio.com"
});

const firestore = admin.firestore()
firestore.settings({timestampsInSnapshots: true});

const IMAGE_MAX_WIDTH = 600;
const IMAGE_MAX_HEIGHT = 800;

/**
 * When an image is uploaded to the Storage bucket, use Sharp to resize it if
 * image's height is greater than given max height.
 */
exports.resizeImage = functions.storage.object().onFinalize((object) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket);

  const fileName = path.basename(filePath);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  const tempResizedFileName = `temp_resized_${fileName}`;
  const tempResizedFilePath = path.join(os.tmpdir(), tempResizedFileName);

  const metadata = {
    contentType: contentType,
  };

  return bucket.file(filePath).download({
    destination: tempFilePath,
  }).then(() => {
    console.log('Image downloaded locally to ', tempFilePath);
    // Get metadata to check current image height
    return sharp(tempFilePath)
      .metadata()
  }).then(info => {
    // Resize image if height is greater than maximum.
    if (info.height > IMAGE_MAX_HEIGHT) {
      console.log('Resizing image at ', tempFilePath);
      return sharp(tempFilePath)
        .resize(
          IMAGE_MAX_WIDTH,
          IMAGE_MAX_HEIGHT,
          { fit: 'inside' })
        .toFile(tempResizedFilePath)
    } else {
      return Promise.reject(new Error(
        `Image height is <${IMAGE_MAX_HEIGHT}; no resize needed.`
      ))
    }
  }).then(
    // Success handler: Image was resized; save it.
    response => {
      console.log('Resized image created at', tempResizedFilePath);
      // TODO: Will need to update link in Firestore
      return bucket.upload(tempResizedFilePath, {
        destination: filePath, // Overwrite original file
        metadata: metadata,
      });
    },
    // Reject handler: No resize was needed; continue without action.
    () => {
      console.log('No resize needed.')
      return null
    }
  ).then(() => {
    console.log('Cleaning up.')
    return fs.unlinkSync(tempFilePath)
  }).catch(error => { console.log(error) });
});


// NOTE TO SUPPORT:  This is where I started to experiment with getting the
// signed URL and writing it back to my 'images' collection in Firestore.
//
// Unfortunately, the image document may or may not have been written yet
// at the time the uploaded file's onFinalize() trigger fires.

/**
 * If an image is resized after upload, Cloud Storage issues a new download URL,
 * rendering the URL in the previously saved record obsolete.  Check the relevant
 * image record in Firestore and update the download URL if needed. 
 */
exports.updateImageDownloadURL = functions.storage.object().onFinalize((object) => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const bucket = admin.storage().bucket(fileBucket);
  const file = bucket.file(filePath);

  const config = {
    action: 'read',
    expires: '03-01-2500',
  };

  console.log('Getting signed url')
  return file.getSignedUrl(config)
    .then(results => {
      const url = results[0];

      console.log(`The signed url for ${file} is ${url}.`);
      return null
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

  // const fileName = path.basename(filePath);
  // const imageRecord = firestore.collection('images').where("name", "==", fileName)
  // imageRecord.get().then(function(querySnapshot){
  //   console.log('querying for matching doc')
  //   querySnapshot.forEach(doc => {
  //     console.log(doc.id, " => ", doc.data());
  //   });
  //   return null
  // }).catch(error => console.log(error));
})
