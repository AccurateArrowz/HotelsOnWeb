const mediaProvider = require('../services/mediaProvider');

exports.getUploadAuth = async (req, res) => {
  try {
    const authParams = mediaProvider.getUploadAuthParams();
    res.json(authParams);
  } catch (error) {
    console.error('Error generating upload auth params:', error);
    res.status(500).json({ error: 'Failed to generate upload authentication parameters' });
  }
};
