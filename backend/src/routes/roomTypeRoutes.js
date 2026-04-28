const express = require('express');
const router = express.Router({ mergeParams: true });
const roomTypeController = require('../controllers/RoomTypeController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Room type CRUD routes
router.get('/', roomTypeController.getRoomTypesByHotel);
router.post('/', roomTypeController.createRoomType);
router.get('/:id', roomTypeController.getRoomTypeById);
router.put('/:id', roomTypeController.updateRoomType);
router.delete('/:id', roomTypeController.deleteRoomType);

module.exports = router;
