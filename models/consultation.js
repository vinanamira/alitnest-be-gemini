import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ConsultationSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    consultantId: { type: mongoose.Schema.Types.ObjectId, required: true },
    messages: [{
        sender: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Consultation = mongoose.model('Consultation', ConsultationSchema);
export default Consultation;