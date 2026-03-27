import ImageKit from 'imagekit-javascript';
import { api } from './api';

const getImageKitClient = () => {
  const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !urlEndpoint) {
    throw new Error('Missing ImageKit configuration. Set VITE_IMAGEKIT_PUBLIC_KEY and VITE_IMAGEKIT_URL_ENDPOINT');
  }

  return new ImageKit({ publicKey, urlEndpoint });
};

export const uploadFile = async ({ file, fileName, folder }) => {
  const imagekit = getImageKitClient();
  const { data: auth } = await api.get('/media/auth');

  const result = await new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file,
        fileName: fileName || file.name,
        folder,
        token: auth.token,
        expire: auth.expire,
        signature: auth.signature,
        useUniqueFileName: true,
      },
      (error, response) => {
        if (error) reject(error);
        else resolve(response);
      }
    );
  });

  return result;
};

export const uploadFiles = async ({ files, folder }) => {
  const uploads = await Promise.all(
    files.map((file) => uploadFile({ file, fileName: file.name, folder }))
  );
  return uploads;
};
