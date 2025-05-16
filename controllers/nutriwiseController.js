import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import Nutriwise from "../models/nutriwise.js";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GoogleGenAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function fileToGenerativePart(fileBuffer, mimeType) {
    return {
        inlineData: {
            data: fileBuffer.toString("base64"),
            mimeType,
        },
    };
}

const analyzeFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: "Analyze this food and return the detailed nutritional information as a JSON object. Required fields: name, description, calories, fat, carbs, protein, and vitamins (vitaminA, vitaminC, calcium, iron, potassium).",
                        },
                        imagePart,
                    ],
                },
            ],
        });

        const response = await result.response;
        const text = await response.text();

        let nutritionInfo;
        try {
            nutritionInfo = JSON.parse(text);
        } catch (err) {
            return res.status(400).json({
                message: "AI did not return valid JSON",
                error: err.message,
                rawResponse: text,
            });
        }

        const requiredFields = ["name", "description", "calories", "fat", "carbs", "protein", "vitamins"];
        const requiredVitamins = ["vitaminA", "vitaminC", "calcium", "iron", "potassium"];

        for (const field of requiredFields) {
            if (!(field in nutritionInfo)) {
                return res.status(400).json({
                    message: "Missing required field",
                    error: `Missing: ${field}`,
                });
            }
        }

        for (const vitamin of requiredVitamins) {
            if (!(vitamin in nutritionInfo.vitamins)) {
                return res.status(400).json({
                    message: "Missing required vitamin",
                    error: `Missing vitamin: ${vitamin}`,
                });
            }
        }

        const newEntry = new Nutriwise({
            ...nutritionInfo,
            image: `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
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