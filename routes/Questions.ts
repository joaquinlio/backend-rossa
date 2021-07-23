
// Dependencias
import { Router } from "express";
import asyncHandler from "express-async-handler";

/**
 * @desc Controlador
 */
import * as QuestionsController from "../controllers/Questions";

// Logged the adding of this route
console.log( "Questions.js: adding routes..." );

/**
 * @desc Questions
 */
const api: Router = Router();

api.get( "/questions", asyncHandler( QuestionsController.getQuestions ) );

export default api;

