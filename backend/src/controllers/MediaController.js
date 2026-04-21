const mediaProvider = require('../services/mediaProvider');
const { sendSuccess, sendInternalError } = require('../utils/apiResponse');

exports.getUploadAuth = async (req, res) => {
  try {
    const authParams = mediaProvider.getUploadAuthParams();
    return sendSuccess(res, authParams);
  } catch (error) {
    console.error('Error generating upload auth params:', error);
    return sendInternalError(res, 'Failed to generate upload authentication parameters');
  }
};
