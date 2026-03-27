const imagekitProvider = require('./imagekitProvider');

const PROVIDERS = {
  imagekit: imagekitProvider
};

const getProvider = () => {
  const providerName = (process.env.MEDIA_PROVIDER || 'imagekit').toLowerCase();
  const provider = PROVIDERS[providerName];

  if (!provider) {
    throw new Error(`Unsupported MEDIA_PROVIDER: ${providerName}`);
  }

  return provider;
};

const getUploadAuthParams = () => {
  const provider = getProvider();
  if (typeof provider.getUploadAuthParams !== 'function') {
    throw new Error('Media provider does not implement getUploadAuthParams');
  }
  return provider.getUploadAuthParams();
};

module.exports = {
  getUploadAuthParams
};
