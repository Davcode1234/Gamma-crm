import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { serviceAccount } from '../../firebase.key.json';

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gamma-crm.appspot.com',
});

const Bucket = getStorage().bucket();

export const uploadImg = async (fileBuffer, fileName) => {
  const file = Bucket.file(fileName);

  const stream = file.createWriteStream({
    metadata: {
      contentType: 'image/jpeg',
    },
    public: true,
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (error) => {
      reject(error);
    });

    stream.on('finish', async () => {
      await file.makePublic();
      resolve(file.publicUrl());
    });

    stream.end(fileBuffer);
  });
};
