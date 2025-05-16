import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  protein: Number,
  fat: Number,
  carbs: Number,
  time: String,        // Format: "HH:MM"
  mealType: String,    // "breakfast", "lunch", "dinner", "snack"
  image: { type: String, default: '' },
}, { _id: false });

const DailyTotalsSchema = new mongoose.Schema({
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 }
}, { _id: false });

const DailyGoalsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, index: true }, // YYYY-MM-DD
  meals: [MealSchema],
  totals: { type: DailyTotalsSchema, default: () => ({}) }
}, { timestamps: true });

export default mongoose.model('DailyGoals', DailyGoalsSchema);