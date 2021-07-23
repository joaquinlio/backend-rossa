
import { Request, Response } from "express";

/**
 * @desc Network
 */
import * as network from "../network/Questions";

/**
 * @desc Utilidades
 */
 const response = require("../utils/Response");

/**
 * @desc Controlador de las preguntas.
 */

/**
 * Lista las preguntas
 * @returns void
 */
export async function getQuestions( req: Request, res: Response): Promise<void> {

    try {
                                                               
        // Guarda la reseña en la base de datos
        const questions = await network.getQuestions()

        if(!questions)
            return response.error(req, res, `controllers/Reviews.ts (getQuestions): error al insertar una reseña`, 500);          

        return response.success(req, res, questions, 200);
        
    } catch (error) {
        console.log(error);
        return response.error(req, res, `controllers/Reviews.ts (getQuestions): error al insertar una reseña [${error}]`, 500);
    }
}