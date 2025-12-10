const e = require('express');
const Cinema = require('../../models/Cinema');

// GET /admin/cinemas -> getAllCinemas
exports.getAllCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.findAll();
    res.status(200).json(cinemas);
  } catch (error) {
    res.status(500).json({ message: 'getAllCinemas error' });
  }
};

// POST /admin/cinemas -> createCinema
exports.createCinema = async (req, res) => {
  try {
    const { name, location: address } = req.body;
    if (!name || !address) {
      return res.status(400).json({ message: 'Missing value (name, address)!' });
    }
    const newCinema = await Cinema.create({ name, location: address });
    res.status(201).json({
      message: 'Cinema created successfully!',
      data: newCinema
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error', error: error.message });
  }
};

// GET /admin/cinemas/:id -> getACinema
exports.getACinema = async (req, res) => {
  try {
    const { id } = req.params;
    const cinema = await Cinema.findByPk(id);
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }   
    res.status(200).json(cinema);
    } catch (error) {
    res.status(500).json({ message: 'getACinema error' });
  }
};

// PUT /admin/cinemas/:id -> updateCinema
exports.updateCinema = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    const cinema = await Cinema.findByPk(id);
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    cinema.name = name || cinema.name;
    cinema.location = location || cinema.location;
    await cinema.save();
    res.status(200).json({ 
        message: 'Cinema updated successfully', cinema 
    });
  } catch (error) {
    res.status(500).json({ message: 'updateCinema error' });
  }
};

// DELETE /admin/cinemas/:id -> deleteCinema
exports.deleteCinema = async (req, res) => {
  try {
    const { id } = req.params;
    const cinema = await Cinema.findByPk(id);
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    await cinema.destroy();
    res.status(200).json({ message: 'Cinema deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'deleteCinema error' });
  }
};

// GET /admin/cinemas/:id/rooms -> getRoomsByCinema
exports.getRoomsByCinema = async (req, res) => {
  try {
    const { id } = req.params;
    const cinema = await Cinema.findByPk(id, { include: 'rooms' });
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    res.status(200).json(cinema.rooms);
  } catch (error) {
    res.status(500).json({ message: 'getRoomsByCinema error' });
  }
};

// POST /admin/cinemas/:id/rooms -> addRoomToCinema
exports.addRoomToCinema = async (req, res) => {
  try {
    const { id } = req.params;  
    const { name, capacity, location } = req.body;
    const cinema = await Cinema.findByPk(id);
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    const newRoom = await cinema.createRoom({ name, capacity, location });
    res.status(201).json({ 
        message: 'Room added to cinema successfully', room: newRoom 
    });
  } catch (error) {
    res.status(500).json({ message: 'addRoomToCinema error' });
  }
};

// DELETE /admin/cinemas/:cinemaId/rooms/:roomId -> removeRoomFromCinema
exports.removeRoomFromCinema = async (req, res) => {
  try {
    const { cinemaId, roomId } = req.params;
    const cinema = await Cinema.findByPk(cinemaId);
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    const room = await cinema.getRooms({ where: { id: roomId } });
    if (room.length === 0) {
      return res.status(404).json({ message: 'Room not found in this cinema' });
    }
    await room[0].destroy();
    res.status(200).json({ message: 'Room removed from cinema successfully' });
  } catch (error) {
    res.status(500).json({ message: 'removeRoomFromCinema error' });
  }
};
