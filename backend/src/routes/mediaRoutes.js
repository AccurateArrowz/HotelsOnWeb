const express = require('express');
const router = express.Router();

const { getUploadAuth } = require('../controllers/MediaController');
const { authenticateToken } = require('../middleware/auth');

//authenticate the user for all routes
router.use(authenticateToken);

router.get('/auth', getUploadAuth);

module.exports = router;
