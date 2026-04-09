import ImageKit from 'imagekit-javascript';

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
  const user = localStorage.getItem('user');
  const token = user ? JSON.parse(user)?.token : null;

  const res = await fetch('http://localhost:3001/api/media/auth', {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    throw new Error('Failed to get media auth');
  }

  const auth = await res.json();

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
