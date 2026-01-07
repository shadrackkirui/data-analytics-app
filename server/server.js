require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const User = require('./models/User');
const Household = require('./models/Household');
const { protect, adminOnly } = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

connectDB();

app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---

//--register route
// --- ADD THIS NEW REGISTRATION ROUTE ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create the new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'enumerator' // Default to enumerator if not specified
    });

    // 3. Send back the user info and token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during registration' });
  }
});
//--login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// --- ENUMERATOR ROUTE (Submit Data) ---
app.post('/api/submit', protect, async (req, res) => {
  try {
    const payload = req.body;
    
    // Simple ETL Logic
    const flags = [];
    if (!payload.age) flags.push("MISSING_AGE");
    const isSenior = payload.age >= 60;
    const isValid = flags.length === 0;

    const household = await Household.findOneAndUpdate(
      { householdId: payload.householdId },
      {
        enumeratorId: req.user._id,
        householdId: payload.householdId,
        location: {
          county: payload.location.county.toUpperCase().trim(),
          ward: payload.location.ward.toUpperCase().trim(),
        },
        demographics: {
          age: payload.age,
          gender: payload.gender,
          isSenior
        },
        dataQuality: { isValid, flags }
      },
      { upsert: true, new: true }
    );

    // Notify Admins via Socket
    io.emit('new_submission', { 
      county: household.location.county, 
      isValid 
    });

    res.status(201).json(household);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- ADMIN ROUTE (Analytics) ---
app.get('/api/analytics', protect, adminOnly, async (req, res) => {
  const total = await Household.countDocuments();
  const valid = await Household.countDocuments({ 'dataQuality.isValid': true });
  const flagged = total - valid;
  
  // Group by County
  const byCounty = await Household.aggregate([
    { $group: { _id: "$location.county", count: { $sum: 1 } } }
  ]);

  res.json({ total, valid, flagged, byCounty });
});

// --- PUBLIC STATS ROUTE (Open Access) ---
app.get('/api/public/stats', async (req, res) => {
  try {
    const totalHouseholds = await Household.countDocuments();
    const distinctCounties = await Household.distinct('location.county');
    
    res.json({
      totalHouseholds,
      countiesCovered: distinctCounties.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public stats' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
