import Consultation from '../models/consultation.js';

export const startConsultation = async (req, res) => {
    try {
        const consultation = new Consultation(req.body);
        await consultation.save();
        res.status(201).json(consultation);
    } catch (error) {
        res.status(500).json({ message: "Error starting consultation", error: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { sessionId, message, sender } = req.body;
        const consultation = await Consultation.findById(sessionId);
        if (!consultation) {
            return res.status(404).json({ message: "Session not found" });
        }
        consultation.messages.push({ sender, message, timestamp: new Date() });
        await consultation.save();
        res.json(consultation);
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
};

export default {
    startConsultation,
    sendMessage
};
