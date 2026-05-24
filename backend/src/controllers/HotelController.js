const { Hotel, HotelImage, RoomType, Room, HotelOwner } = require('../models');
const { sendSuccess, sendBadRequest, sendNotFound, sendInternalError } = require('../utils/apiResponse');
const { Op } = require('sequelize');

const IMAGEKIT_BASE_URL = 'https://ik.imagekit.io/kbk987i3nx/hotels-on-web-images';

//images that will be shared for all hotels
const SHARED_IMAGES = [
  'reception .jpg',
  'room-1.jpg',
  'room-2.jpg',
  'room-3.jpg',
  'room-4.jpg',
  'washroom1.jpg',
  'washrooom-2.jpg',
  'pool.jpg'
]; //written in array to show them in right order (first primaryImages-> reception -> room-> washroom -> pool)

// Fetch hotel by ID, including images and rooms
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({
      where: { id: req.params.id, isActive: true },
      attributes: { exclude: ['createdAt', 'updatedAt', 'isActive'] },
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
          required: false,
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

    // Get primary image from database
    const primaryImage = hotelJson.images.find(img => img.isPrimary);

    // Build images array: primary image first, then shared images from ImageKit
    const finalImages = [];

    if (primaryImage) {
      finalImages.push({
        id: primaryImage.id,
        imageUrl: primaryImage.imageUrl,
        isPrimary: true,
        orderIndex: 0
      });
    }

    // Append shared images from ImageKit in the specified order
    SHARED_IMAGES.forEach((imageName, index) => {
      finalImages.push({
        id: `shared-${index}`,
        imageUrl: `${IMAGEKIT_BASE_URL}/${imageName}`,
        isPrimary: false,
        orderIndex: primaryImage ? index + 1 : index
      });
    });

    hotelJson.images = finalImages;

    return sendSuccess(res, { data: hotelJson });
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return sendInternalError(res, 'Failed to fetch hotel');
  }
};

const DEFAULT_LIMIT = 20;

const getHotels = async (req, res) => {
    const { search, limit = DEFAULT_LIMIT, offset = 0 } = req.query;
    if (!search || search.trim() === '') {
      return sendBadRequest(res, 'Missing or invalid search query parameter');
    }
    const parsedLimit = Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, 100);
    const parsedOffset = parseInt(offset, 10) || 0;
    try {
      const { count, rows: hotels } = await Hotel.findAndCountAll({
        where: {
          [Op.or]: [
            { city: { [Op.iLike]: `%${search}%` } },
            { name: { [Op.iLike]: `%${search}%` } }
          ],
          isActive: true
        },
        //fetching primary img only
        include: [{
          model: HotelImage,
          as: 'images',
          where: { isPrimary: true },
          required: false,
          attributes: ['id', 'imageUrl', 'isPrimary']
        }],
        limit: parsedLimit,
        offset: parsedOffset,
        subQuery: false // needed so limit/offset apply to hotels, not joined rows
      });

      const hotelsWithPrimaryImg = hotels.map(hotel => {
        const hotelJson = hotel.toJSON();
        hotelJson.hotelImg = hotelJson.images && hotelJson.images.length > 0 ? hotelJson.images[0].imageUrl : null;
        delete hotelJson.images;
        delete hotelJson.createdAt;
        delete hotelJson.updatedAt;
        delete hotelJson.isActive;
        return hotelJson;
      });

      return sendSuccess(res, {
        data: hotelsWithPrimaryImg,
        pagination: {
          total: count,
          limit: parsedLimit,
          offset: parsedOffset,
          hasMore: parsedOffset + parsedLimit < count
        }
      });
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
      attributes: [],
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
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
              required: false,
              attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            {
              model: Room,
              as: 'rooms',
              required: false,
              attributes: { exclude: ['createdAt', 'updatedAt', 'roomId'] }
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
  getHotels,
  getMyHotels
};
