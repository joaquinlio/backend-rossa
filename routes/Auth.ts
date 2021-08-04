
// Dependencias
import { Router } from "express";
import asyncHandler from "express-async-handler";

/**
 * @desc Controlador
 */
import * as AuthController from "../controllers/Auth";

// Logged the adding of this route
console.log( "Auth.js: adding routes..." );

/**
 * @desc Auth
 */
const api: Router = Router();

api.post( "/auth/login",        asyncHandler( AuthController.login ) );


export default api;

