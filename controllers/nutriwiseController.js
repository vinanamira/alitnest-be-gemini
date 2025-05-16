import GoogleGenAI  from "@google/genai";
import multer from "multer";
import Nutriwise from "../models/nutriwise.js";
import 'dotenv/config';

const ai = new GoogleGenAI({
    apiKey: process.env.GoogleGenAI_API_KEY,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const analyzeFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imageBuffer = req.file.buffer.toString("base64");
        const imageBase64 = `data:image/jpeg;base64,${imageBuffer}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "system",
                    content: "You are an AI that identifies food and provides detailed nutritional information. The response must be a valid JSON object with the following required fields: name (string), description (string), calories (number), fat (number), carbs (number), protein (number), and vitamins (object with vitaminA, vitaminC, calcium, iron, potassium). Ensure all fields are present, even if the values are estimated.",
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analyze this food and return the detailed nutritional information in JSON format." },
                        { type: "image_url", image_url: { url: imageBase64 } },
                    ],
                },
            ],
            response_format: { type: "json_object" },
            max_tokens: 2048,
        });

        const nutritionInfo = JSON.parse(response.choices[0].message.content);

        const requiredFields = ["name", "description", "calories", "fat", "carbs", "protein", "vitamins"];
        const requiredVitamins = ["vitaminA", "vitaminC", "calcium", "iron", "potassium"];

        for (const field of requiredFields) {
            if (!(field in nutritionInfo)) {
                return res.status(400).json({
                    message: "Error analyzing food",
                    error: `Missing required field: ${field}`,
                });
            }
        }

        for (const vitamin of requiredVitamins) {
            if (!(vitamin in nutritionInfo.vitamins)) {
                return res.status(400).json({
                    message: "Error analyzing food",
                    error: `Missing required vitamin: ${vitamin}`,
                });
            }
        }

        const newEntry = new Nutriwise({
            ...nutritionInfo,
            image: imageBase64 
        });
        await newEntry.save();

        res.json({
            message: "Food analyzed successfully",
            data: nutritionInfo,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error analyzing food",
            error: error.message,
        });
    }
};

export default { upload, analyzeFood };