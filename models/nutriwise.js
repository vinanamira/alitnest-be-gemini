import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NutriwiseSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    calories: { type: Number, required: true },
    fat: { type: Number, required: true },
    carbs: { type: Number, required: true },
    protein: { type: Number, required: true },
    vitamins: {
        vitaminA: { type: Number, required: true },
        vitaminC: { type: Number, required: true },
        calcium: { type: Number, required: true },
        iron: { type: Number, required: true },
        potassium: { type: Number, required: true }
    },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Nutriwise = mongoose.model('Nutriwise', NutriwiseSchema);
export default Nutriwise;