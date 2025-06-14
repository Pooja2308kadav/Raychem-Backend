const Location = require('../models/Location.model');

const createLocation = async (req, res) => {
  try {
    const { name, street, city, state, country, postalCode } = req.body;

    if (!name || !street || !city || !state || !country || !postalCode) {
      return res.status(400).json({ message: 'All address fields are required' });
    }

    const location = new Location({ name, street, city, state, country, postalCode });
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    console.error('Error in createLocation:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    console.error('Error in getLocations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, street, city, state, country, postalCode } = req.body;

    if (!name || !street || !city || !state || !country || !postalCode) {
      return res.status(400).json({ message: 'All address fields are required' });
    }

    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    location.name = name;
    location.street = street;
    location.city = city;
    location.state = state;
    location.country = country;
    location.postalCode = postalCode;
    location.updatedAt = Date.now();

    await location.save();
    res.status(200).json(location);
  } catch (err) {
    console.error('Error in updateLocation:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await Location.deleteOne({ _id: id });
    res.status(200).json({ message: 'Location deleted' });
  } catch (err) {
    console.error('Error in deleteLocation:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createLocation, getLocations, updateLocation, deleteLocation };