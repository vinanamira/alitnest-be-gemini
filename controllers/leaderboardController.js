import Leaderboard from '../models/leaderboard.js';

export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find().sort({ score: -1 });
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving leaderboard", error: error.message });
    }
};

export default {getLeaderboard};