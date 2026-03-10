const { Hotel, HotelImage, RoomType } = require('../models');

// Fetch hotel by ID, including images and rooms
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id, {
      include: [
        {
          model: HotelImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isPrimary', 'orderIndex']
        },
        {
          model: RoomType,
          as: 'roomTypes',
          attributes: { exclude: ['createdAt', 'updatedAt', 'isActive'] }
        }
      ]
    });
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    const hotelJson = hotel.toJSON();
    hotelJson.images = hotelJson.images || [];
    hotelJson.roomTypes = hotelJson.roomTypes || [];
    res.json(hotelJson);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
};

exports.getAllHotelsByCity =  async (req, res) => {
    const query = req.query.q;
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Missing or invalid search query parameter' });
    }
    try {
      const { Op } = require('sequelize');
      // Fetch hotels with their primary image only, searching by both city and hotel name
      const hotels = await Hotel.findAll({
        where: {
          [Op.or]: [
            { city: { [Op.iLike]: `%${query}%` } },
            { name: { [Op.iLike]: `%${query}%` } }
          ],
          isActive: true
        },
        include: [{
          model: HotelImage,
          as: 'images',
          where: { isPrimary: true },
          required: false, // Ensure hotels without primary image are included
          attributes: ['id', 'imageUrl', 'isPrimary']
        }]
      });
      // res.json(hotels);
  
      // if all imgs were fetched from cloud and only primary image is to be sent
      const hotelsWithPrimaryImg = hotels.map(hotel => {
        const hotelJson = hotel.toJSON();
        hotelJson.hotelImg = hotelJson.images && hotelJson.images.length > 0 ? hotelJson.images[0].imageUrl : null;
        delete hotelJson.images;
        return hotelJson;
      });
      res.json(hotelsWithPrimaryImg);

      console.log(`[HOTEL_SEARCH] Response sent for query: ${query}`);
    } catch (error) {
      console.error('Error fetching hotels by query:', error);
      res.status(500).json({ error: 'Failed to fetch hotels by query' });
    }
  };