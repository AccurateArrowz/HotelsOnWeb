const { HotelRequest, HotelRequestImage, User } = require('../models');
const { sendSuccess, sendBadRequest, sendNotFound, sendInternalError } = require('../utils/apiResponse');

// Create a new hotel listing request
exports.createHotelRequest = async (req, res) => {
  try {
    // Get user from request (set by auth middleware)
    const userId = req.user.id;
    
    // Extract hotel data from request body
    const { name, description, street, city, country, imageUrls } = req.body;
    
    // Validate required fields
    if (!name || !street || !city || !country) {
      return sendBadRequest(res, 'Missing required fields: name, street, city, and country are required');
    }
    
    // Create hotel request
    const hotelRequest = await HotelRequest.create({
      name,
      description: description || '',
      street,
      city,
      country,
      userId
    });
    
    // Persist image URLs (uploaded directly to the media provider from the client)
    const images = [];
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];

        if (typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
          continue;
        }

        const image = await HotelRequestImage.create({
          hotelRequestId: hotelRequest.id,
          imageUrl: imageUrl.trim(),
          isPrimary: i === 0,
          orderIndex: i
        });

        images.push(image);
      }
    }
    
    // Return success response
    return sendSuccess(
      res,
      {
        data: {
          ...hotelRequest.toJSON(),
          images
        },
        message: 'Hotel listing request submitted successfully'
      },
      201
    );
  } catch (error) {
    console.error('Error creating hotel request:', error);
    return sendInternalError(res, 'Failed to submit hotel listing request');
  }
};

// Get all hotel requests for a user
exports.getUserHotelRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const hotelRequests = await HotelRequest.findAll({
      where: { userId },
      include: [{
        model: HotelRequestImage,
        as: 'images',
        attributes: ['id', 'imageUrl', 'isPrimary', 'orderIndex']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    return sendSuccess(res, { data: hotelRequests });
  } catch (error) {
    console.error('Error fetching hotel requests:', error);
    return sendInternalError(res, 'Failed to fetch hotel requests');
  }
};

// Get a specific hotel request by ID
exports.getHotelRequestById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const hotelRequest = await HotelRequest.findOne({
      where: { id, userId },
      include: [{
        model: HotelRequestImage,
        as: 'images',
        attributes: ['id', 'imageUrl', 'isPrimary', 'orderIndex']
      }]
    });
    
    if (!hotelRequest) {
      return sendNotFound(res, 'Hotel request not found');
    }
    
    return sendSuccess(res, { data: hotelRequest });
  } catch (error) {
    console.error('Error fetching hotel request:', error);
    return sendInternalError(res, 'Failed to fetch hotel request');
  }
};

// Get hotel requests with optional status filter (admin only)
exports.getHotelRequests = async (req, res) => {
  try {
    const { status } = req.query;

    // Validate status if provided
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return sendBadRequest(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const whereClause = status ? { status } : {};

    const requests = await HotelRequest.findAll({
      where: whereClause,
      include: [
        {
          model: HotelRequestImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isPrimary', 'orderIndex']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transform to match frontend field names
    const transformedRequests = requests.map(req => {
      const plain = req.toJSON();
      const ownerName = plain.user
        ? `${plain.user.firstName} ${plain.user.lastName}`
        : 'Unknown';

      return {
        ...plain,
        hotelName: plain.name,
        address: plain.street,
        street: plain.street,
        ownerId: plain.userId,
        ownerName,
      };
    });

    return sendSuccess(res, { data: transformedRequests });
  } catch (error) {
    console.error('Error fetching hotel requests:', error);
    return sendInternalError(res, 'Failed to fetch hotel requests');
  }
};

// Update hotel request status (admin only)
exports.updateHotelRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const adminId = req.user.id;


    const hotelRequest = await HotelRequest.findByPk(id);
    if (!hotelRequest) {
      return sendNotFound(res, 'Hotel request not found');
    }

    // Validate status
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return sendBadRequest(res, 'Invalid status. Must be approved or rejected');
    }


    // Prevent updating already processed requests
    if (hotelRequest.status !== 'pending') {
      return sendBadRequest(res, 'Request has already been processed');
    }

    // Update request
    await hotelRequest.update({
      status,
      adminNotes: adminNotes || null,
      processedAt: new Date(),
      processedBy: adminId
    });

    // If approved, create the actual hotel
    let createdHotel = null;
    if (status === 'approved') {
      const { Hotel, HotelImage } = require('../models');

      createdHotel = await Hotel.create({
        name: hotelRequest.name,
        description: hotelRequest.description,
        street: hotelRequest.street,
        city: hotelRequest.city,
        country: hotelRequest.country,
        hotelOwnerId: hotelRequest.userId,
        isActive: true
      });

      // Copy images to hotel
      const images = await HotelRequestImage.findAll({
        where: { hotelRequestId: id }
      });

      for (const img of images) {
        await HotelImage.create({
          hotelId: createdHotel.id,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary,
          orderIndex: img.orderIndex
        });
      }
    }

    return sendSuccess(
      res,
      {
        ...hotelRequest.toJSON(),
        createdHotel: createdHotel ? { id: createdHotel.id, name: createdHotel.name } : null
      },
      `Hotel request ${status} successfully`
    );
  } catch (error) {
    console.error('Error updating hotel request status:', error);
    return sendInternalError(res, 'Failed to update hotel request status');
  }
};
