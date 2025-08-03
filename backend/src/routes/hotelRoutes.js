const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const HotelImage = require('../models/HotelImage');
const {getAllHotelsByCity,getHotelById} = require('../controllers/HotelController');

// right now, I am not providing all hotels from all cities , the city will be provided as query parameter
router.get('/',getAllHotelsByCity);

// Get hotel by ID with all images and rooms
router.get('/:id', getHotelById);

module.exports = router; 