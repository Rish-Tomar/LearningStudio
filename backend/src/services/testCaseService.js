import mongoose from "mongoose";
import TestCase from "../models/TestCase.js";
import Question from "../models/Question.js";
import AppError from "../utils/AppError.js";
import { QUESTION_TYPE } from "../constants/questionType.js";

export const createTestCase = async (testCaseData) => {

    const {
        question,
        executionOrder
    } = testCaseData;

    console.log("TestCase question ID:", question);
    console.log("Question ID type:", typeof question);

    if (!mongoose.Types.ObjectId.isValid(question)) {
        throw new AppError(
            "Invalid question ID",
            400
        );
    }

    const existingQuestion = await Question.findById(question);

    if (!existingQuestion) {
        throw new AppError(
            "Question not found",
            404
        );
    }

    if (existingQuestion.questionType !== QUESTION_TYPE.CODING) {
        throw new AppError(
            "Test cases can only be created for coding questions",
            400
        );
    }

    const existingOrder = await TestCase.findOne({
        question,
        executionOrder
    });

    if (existingOrder) {
        throw new AppError(
            "Execution order already exists for this question",
            409
        );
    }

    const testCase = await TestCase.create(testCaseData);

    return testCase;
};