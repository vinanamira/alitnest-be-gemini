import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LeaderboardSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true }
}, { timestamps: true });

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);
export default Leaderboard;