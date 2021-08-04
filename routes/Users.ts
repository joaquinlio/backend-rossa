
// Dependencias
import { Router } from "express";
import asyncHandler from "express-async-handler";

/**
 * @desc Controlador
 */
import * as UsersController from "../controllers/Users";

// Logged the adding of this route
console.log( "Users.js: adding routes..." );

/**
 * @desc Users
 */
const api: Router = Router();

api.get( "/users",        asyncHandler( UsersController.getUsers ) );
api.post( "/users",        asyncHandler( UsersController.addUser ) );


export default api;

