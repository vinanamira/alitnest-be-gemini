import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workoutName: { type: String, required: true },
    duration: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true }
}, { timestamps: true });

const Workout = mongoose.model('Workout', WorkoutSchema);
export default Workout;