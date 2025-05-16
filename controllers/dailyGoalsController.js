import DailyGoals from '../models/dailyGoals.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const addMeal = async (req, res) => {
  try {
    const { userId, date, meal } = req.body;
    const imageFile = req.file; 

    if (!userId || !date || !meal) {
      return res.status(400).json({
        success: false,
        message: 'userId, date, dan meal wajib diisi'
      });
    }

    let imageBase64 = '';
    if (imageFile) {
      imageBase64 = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Format tanggal tidak valid. Gunakan YYYY-MM-DD'
      });
    }

    const formattedDate = new Date(parsedDate.setHours(0, 0, 0, 0));

    let dailyRecord = await DailyGoals.findOne({ userId, date: formattedDate });

    if (!dailyRecord) {
      dailyRecord = new DailyGoals({ 
        userId, 
        date: formattedDate,
        meals: [],
        totals: { calories: 0, protein: 0, fat: 0, carbs: 0 }
      });
    }

    const newMeal = {
      name: meal.name || 'Makanan tanpa nama',
      calories: meal.calories || 0,
      protein: meal.protein || 0,
      fat: meal.fat || 0,
      carbs: meal.carbs || 0,
      time: meal.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mealType: meal.mealType || 'unspecified',
      image: imageBase64
    };

    dailyRecord.meals.push(newMeal);
    
    dailyRecord.totals.calories += newMeal.calories;
    dailyRecord.totals.protein += newMeal.protein;
    dailyRecord.totals.fat += newMeal.fat;
    dailyRecord.totals.carbs += newMeal.carbs;

    await dailyRecord.save();

    res.status(200).json({
      message: "Makanan berhasil ditambahkan",
      data: {
        userId,
        day: formattedDate.getDate(),
        date: formattedDate.toISOString(),
        meals: dailyRecord.meals.map(m => ({
          id: m._id,
          name: m.name,
          calories: m.calories,
          protein: m.protein,
          fat: m.fat,
          carbs: m.carbs,
          time: m.time,
          mealType: m.mealType,
          image: m.image 
        }))
      }
    });

  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Gagal menyimpan makanan',
      error: err.message 
    });
  }
};

export const getDailyTotals = async (req, res) => {
  try {
    const { userId, date } = req.params;

    // Validasi parameter
    if (!userId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Parameter userId dan date wajib diisi'
      });
    }

    // Parse tanggal
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Format tanggal tidak valid. Gunakan YYYY-MM-DD'
      });
    }

    const startDate = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endDate = new Date(parsedDate.setHours(23, 59, 59, 999));

    const data = await DailyGoals.findOne({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    if (!data) {
      return res.status(200).json({
        success: true,
        date: startDate.toISOString(),
        totals: {
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      date: data.date.toISOString(),
      totals: data.totals
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil total harian',
      error: err.message
    });
  }
};

export const getDailyMeals = async (req, res) => {
  try {
    const { userId, date } = req.params;

    if (!userId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Parameter userId dan date wajib diisi'
      });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Format tanggal tidak valid. Gunakan YYYY-MM-DD'
      });
    }

    const startDate = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endDate = new Date(parsedDate.setHours(23, 59, 59, 999));

    const data = await DailyGoals.findOne({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    if (!data) {
      return res.status(200).json({
        success: true,
        date: startDate.toISOString(),
        meals: []
      });
    }

    res.status(200).json({
      success: true,
      date: data.date.toISOString(),
      meals: data.meals.map(meal => ({
        id: meal._id,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        fat: meal.fat,
        carbs: meal.carbs,
        time: meal.time,
        mealType: meal.mealType
      }))
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar makanan',
      error: err.message
    });
  }
};

export default {  upload, addMeal, getDailyTotals, getDailyMeals };