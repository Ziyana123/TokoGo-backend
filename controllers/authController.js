const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Generate Token
const generateToken = (user) => {
    return jwt.sign({ userId: user.id, role: user.role || (user.isAdmin ? 'admin' : 'user') }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
exports.register = async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, phone, address });

        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'None', 
            maxAge: 24 * 60 * 60 * 1000, 
        });

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role || (user.isAdmin ? 'admin' : 'user'),
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Logout
exports.logout = (req, res) => {
    res.clearCookie('token'); // Clear the token cookie
    res.json({ message: 'Logged out successfully' });
};

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        console.log('Decoded user:', req.user);
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
