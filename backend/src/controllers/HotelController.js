const { Hotel, HotelImage, RoomType, Room, HotelOwner } = require('../models');
const { sendSuccess, sendBadRequest, sendNotFound, sendInternalError } = require('../utils/apiResponse');
const { Op } = require('sequelize');

// Fetch hotel by ID, including images and rooms
const getHotelById = async (req, res) => {
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
      return sendNotFound(res, 'Hotel not found');
    }
    const hotelJson = hotel.toJSON();
    hotelJson.images = hotelJson.images || [];
    hotelJson.roomTypes = hotelJson.roomTypes || [];
    return sendSuccess(res, { data: hotelJson });
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return sendInternalError(res, 'Failed to fetch hotel');
  }
};

const getAllHotelsByCity = async (req, res) => {
    const query = req.query.q;
    console.log(query);
    if (!query || query.trim() === '') {
      return sendBadRequest(res, 'Missing or invalid search query parameter');
    }
    try {
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
      return sendSuccess(res, {data: hotelsWithPrimaryImg});

      console.log(`[HOTEL_SEARCH] Response sent for query: ${query}`);
    } catch (error) {
      console.error('Error fetching hotels by query:', error);
      return sendInternalError(res, 'Failed to fetch hotels by query');
    }
  };

// Get hotels owned by the authenticated user
const getMyHotels = async (req, res) => {
  try {
    const userId = req.user.id;

    const hotelOwners = await HotelOwner.findAll({
      where: { userId },
      include: [
        {
          model: Hotel,
          as: 'hotel',
          include: [
            {
              model: HotelImage,
              as: 'images',
              attributes: ['id', 'imageUrl', 'isPrimary', 'orderIndex']
            },
            {
              model: RoomType,
              as: 'roomTypes',
              where: { isActive: true },
              required: false
            },
            {
              model: Room,
              as: 'rooms',
              required: false
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const hotels = hotelOwners.map(ho => {
      const hoData = ho.toJSON();
      return hoData.hotel;
    }).filter(hotel => hotel != null);
    return sendSuccess(res, { data: hotels });
  } catch (error) {
    console.error('Error fetching owner hotels:', error);
    return sendInternalError(res, 'Failed to fetch your hotels');
  }
};

module.exports = {
  getHotelById,
  getAllHotelsByCity,
  getMyHotels
};