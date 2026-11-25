require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const workoutRoutes = require('./routes/workouts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root health check
app.get('/', (req, res) => {
  res.json({ message: 'Workout Buddy Express + MongoDB API is running' });
});

// Routes
app.use('/api/workouts', workoutRoutes);

// Connect to DB & start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas Connected');
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  });