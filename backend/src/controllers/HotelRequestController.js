const { HotelRequest, HotelRequestImage } = require('../models');

// Create a new hotel listing request
exports.createHotelRequest = async (req, res) => {
  try {
    // Get user from request (set by auth middleware)
    const userId = req.user.id;
    
    // Extract hotel data from request body
    const { name, description, street, city, country, imageUrls } = req.body;
    
    // Validate required fields
    if (!name || !street || !city || !country) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, street, city, and country are required' 
      });
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
    res.status(201).json({
      message: 'Hotel listing request submitted successfully',
      hotelRequest: {
        ...hotelRequest.toJSON(),
        images
      }
    });
  } catch (error) {
    console.error('Error creating hotel request:', error);
    res.status(500).json({ error: 'Failed to submit hotel listing request' });
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
    
    res.json(hotelRequests);
  } catch (error) {
    console.error('Error fetching hotel requests:', error);
    res.status(500).json({ error: 'Failed to fetch hotel requests' });
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
      return res.status(404).json({ error: 'Hotel request not found' });
    }
    
    res.json(hotelRequest);
  } catch (error) {
    console.error('Error fetching hotel request:', error);
    res.status(500).json({ error: 'Failed to fetch hotel request' });
  }
};
