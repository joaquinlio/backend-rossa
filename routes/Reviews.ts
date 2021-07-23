
// Dependencias
import { Router } from "express";
import asyncHandler from "express-async-handler";

/**
 * @desc Controlador
 */
import * as ReviewsController from "../controllers/Reviews";

// Logged the adding of this route
console.log( "Reviews.js: adding routes..." );

/**
 * @desc Reviews
 */
const api: Router = Router();

api.post( "/reviews/add",   asyncHandler( ReviewsController.addReview ) );
api.get( "/reviews",        asyncHandler( ReviewsController.getReviews ) );
api.get( "/reviews/:id",    asyncHandler( ReviewsController.getReview ) );


export default api;

