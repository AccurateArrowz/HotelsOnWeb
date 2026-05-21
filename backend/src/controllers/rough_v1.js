const { Op } = require("sequelize");
const { Room } = require("src/models");

const roomsAvailability = async (req, res) =>  {
    const {hotelId, requestedCheckIn, requestedCheckOut }= req;
    //find all the rooms in the hotel
    const allRooms = Room.find({where: {
        id: hotelId
    }, 
attributes: ['roomId', 'roomType']});

    //find unavailable rooms on the requested dates
   const unavailableRooms = await bookingRooms.findAll({
  where: {
    hotelId: hotelId,
     [Op.or]: [
      { check_in: { [Op.between]: [requestedCheckIn, requestedCheckOut] } },
      { check_out: { [Op.between]: [requestedCheckIn, requestedCheckOut] } }
    ]
  },
  attributes: ['roomId']
});
const unavailableRoomIds = unavailableRooms.map(room => room.roomId);
    const availableRooms = allRooms.filter(room => !unavailableRooms.includes(room.id));
    //group and send all the available rooms
}
