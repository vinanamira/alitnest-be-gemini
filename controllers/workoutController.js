import Workout from '../models/workout.js';

export const createWorkout = async (req, res) => {
    try {
        const workout = new Workout(req.body);
        await workout.save();
        res.status(201).json(workout);
    } catch (error) {
        res.status(500).json({ message: "Error saving workout", error: error.message });
    }
};

export default {createWorkout};