const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');

// GET /api/workouts - fetch all workouts (latest first)
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({}).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/workouts - create a workout with validation
const createWorkout = async (req, res) => {
  const { title, load, reps } = req.body;

  const emptyFields = [];
  if (!title || !title.trim()) emptyFields.push('title');
  if (load === '' || load === undefined || load === null) emptyFields.push('load');
  if (reps === '' || reps === undefined || reps === null) emptyFields.push('reps');

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill in all the fields', emptyFields });
  }

  if (Number(load) < 0 || Number(reps) <= 0 || Number.isNaN(Number(load)) || Number.isNaN(Number(reps))) {
    const invalidFields = [];
    if (Number(load) < 0 || Number.isNaN(Number(load))) invalidFields.push('load');
    if (Number(reps) <= 0 || Number.isNaN(Number(reps))) invalidFields.push('reps');
    return res
      .status(400)
      .json({ error: 'Load must be 0 or greater and Reps must be at least 1', emptyFields: invalidFields });
  }

  try {
    const workout = await Workout.create({
      title: title.trim(),
      load: Number(load),
      reps: Number(reps),
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message, emptyFields: [] });
  }
};

// DELETE /api/workouts/:id - delete workout by id
const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' });
  }

  try {
    const workout = await Workout.findOneAndDelete({ _id: id });
    if (!workout) {
      return res.status(404).json({ error: 'No such workout' });
    }
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWorkouts,
  createWorkout,
  deleteWorkout,
};