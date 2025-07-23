const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      where: { isActive: true },
      order: [['rating', 'DESC']]
    });
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// Get hotels by city
router.get('/city/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    
    // Case-insensitive search for city name
    const hotels = await Hotel.findAll({
      where: {
        city: {
          [require('sequelize').Op.iLike]: `%${cityName}%`
        },
        isActive: true
      },
      order: [['rating', 'DESC']]
    });
    
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels by city:', error);
    res.status(500).json({ error: 'Failed to fetch hotels by city' });
  }
});

// Get hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
});

module.exports = router; 