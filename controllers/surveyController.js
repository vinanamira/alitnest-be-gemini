import Survey from '../models/survey.js';

export const createSurvey = async (req, res) => {
    try {
        const surveyData = req.body;
        const survey = new Survey(surveyData);
        await survey.save();
        res.status(201).json({
            status: "SUCCESS",
            message: "Survey saved successfully",
            data: survey
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: "Error saving survey",
            error: error.message
        });
    }
};

export const getSurveyById = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await Survey.findById(id);
        if (!survey) {
            return res.status(404).json({
                status: "FAILED",
                message: "Survey not found"
            });
        }
        res.status(200).json({
            status: "SUCCESS",
            data: survey
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: "Error fetching survey",
            error: error.message
        });
    }
};

export default {
    createSurvey,
    getSurveyById
};