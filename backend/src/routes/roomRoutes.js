const express = require('express');
const router = express.Router({ mergeParams: true });
const roomController = require('../controllers/RoomController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Room CRUD routes
router.get('/', roomController.getRoomsByHotel);
router.post('/', roomController.createRoom);
router.get('/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
