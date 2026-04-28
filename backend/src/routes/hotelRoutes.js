const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const HotelImage = require('../models/HotelImage');
const {getAllHotelsByCity,getHotelById, getMyHotels} = require('../controllers/HotelController');
const { authenticateToken } = require('../middleware/auth');

// right now, I am not providing all hotels from all cities , the city will be provided as query parameter
router.get('/',getAllHotelsByCity);

// Get hotel by ID with all images and rooms
router.get('/:id', getHotelById);

// Get hotels owned by the authenticated user (owner only)
router.get('/owner/my-hotels', authenticateToken, getMyHotels);

module.exports = router; 