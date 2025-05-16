import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SurveySchema = new Schema({
    name: { type: String, required: true },
    goal: {
        type: String,
        enum: ['Menurunkan berat badan', 'Menaikkan berat badan', 'Menjaga berat badan'],
        required: true
    },
    birthDate: { type: Date, required: true },
    activityLevel: {
        type: String,
        enum: [
            'Sedentary (sedikit atau tidak berolahraga sama sekali)',
            'Aktif ringan (olahraga ringan 1-3 hari/minggu)',
            'Aktif sedang (olahraga sedang 3-5 hari/minggu)',
            'Sangat aktif (olahraga berat 6-7 hari/minggu)',
            'Ekstra aktif (olahraga sangat berat 2x/hari)'
        ],
        required: true
    },
    height: { type: Number, required: true }, // dalam cm
    currentWeight: { type: Number, required: true }, // dalam kg
    gender: { type: String, enum: ['Perempuan', 'Laki-laki'], required: true },
    targetWeight: { type: Number, required: true }, // dalam kg
    weightGoalSpeed: { type: Number, min: 0.1, max: 1.5, required: true } // dalam kg/week
}, { timestamps: true });

const Survey = mongoose.model('Survey', SurveySchema);
export default Survey;