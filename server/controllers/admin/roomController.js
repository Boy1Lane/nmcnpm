const Room = require('../../models/Room');
const Cinema = require('../../models/Cinema');   // <-- THÊM DÒNG NÀY

// GET /admin/rooms -> getAllRooms

// exports.getAllRooms = async (req, res) => {
//   try {
//     const rooms = await Room.findAll();
//     res.status(200).json(rooms);
//   } catch (error) {
//     res.status(500).json({ message: 'getAllRooms error' });
//   }
// };

// POST /admin/rooms -> createRoom
exports.createRoom = async (req, res) => {
  try {
    const { name, capacity, location } = req.body; 
    if (!name || !capacity) {
      return res.status(400).json({ message: 'Missing value (name, capacity)!' });
    }
    const newRoom = await Room.create({ name, capacity, location });
    res.status(201).json({
      message: 'Room created successfully!',
      data: newRoom
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error', error: error.message });
  }
};

// GET /admin/rooms/:id -> getARoom
exports.getARoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'getARoom error' });
  }
};

// PUT /admin/rooms/:id -> updateRoom
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, location } = req.body;
    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    room.name = name || room.name;
    room.capacity = capacity || room.capacity;
    room.location = location || room.location;
    await room.save();
    res.status(200).json({ 
        message: 'Room updated successfully', room 
    });
  } catch (error) {
    res.status(500).json({ message: 'updateRoom error' });
  }
};

// DELETE /admin/rooms/:id -> deleteRoom
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    await room.destroy();
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'deleteRoom error' });
  }
};


//sua them
// GET /admin/rooms -> getAllRooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [
        {
          model: Cinema,
          attributes: ["id", "name", "address"] // giữ nhẹ nhàng, không phá JSON cũ
        }
      ]
    });

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'getAllRooms error' }); // GIỮ NGUYÊN
  }
};
