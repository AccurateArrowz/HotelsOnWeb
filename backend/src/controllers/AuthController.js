const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Role } = require('../models');

// Function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  const { firstName, lastName, phone, email, password, role: incomingRole } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Use role directly from request or default to customer
    const roleKey = incomingRole || 'customer';
    const roleRecord = await Role.findOne({ where: { key: roleKey } });
    
    if (!roleRecord) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.create({
      firstName,
      lastName,
      phone,
      email,
      password,
      roleId: roleRecord.id,
    });

    if (user) {
      // Get role key for response
      const roleRecord = await Role.findByPk(user.roleId);
      const roleKey = roleRecord ? roleRecord.key : 'customer';
      
      res.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: roleKey,
        roleId: user.roleId,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.comparePassword(password))) {
      // Get role information from roleId
      const roleRecord = await Role.findByPk(user.roleId);
      const roleKey = roleRecord ? roleRecord.key : 'customer';



      res.json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: roleKey,
        roleId: user.roleId,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
