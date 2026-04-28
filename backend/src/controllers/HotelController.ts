import { Hotel, HotelImage, RoomType, Room } from '../models';
import { sendSuccess, sendBadRequest, sendNotFound, sendInternalError } from '../utils/apiResponse';
import { Request, Response } from 'express';
import { Op } from 'sequelize';

// Fetch hotel by ID, including images and rooms
export const getHotelById = async (req: Request, res: Response) => {
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

export const getAllHotelsByCity = async (req: Request, res: Response) => {
    const query = req.query.q as string;
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
export const getMyHotels = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: { id: number } }).user.id;

    const hotels = await Hotel.findAll({
      where: { hotelOwnerId: userId },
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
      ],
      order: [['createdAt', 'DESC']]
    });

    return sendSuccess(res, { data: hotels });
  } catch (error) {
    console.error('Error fetching owner hotels:', error);
    return sendInternalError(res, 'Failed to fetch your hotels');
  }
};