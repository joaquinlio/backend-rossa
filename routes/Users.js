
// Dependencias
const express = require("express");
const asyncHandler = require("express-async-handler");

/**
 * @desc Controlador
 */
const UsersController = require("../controllers/Users");

// Logged the adding of this route
console.log( "Users.js: adding routes..." );

// Create a router for all stores endpoints
const router = express.Router();

/**
 * @desc Logeo
 */
router.post( "/login", asyncHandler( UsersController.login ) );
router.post( "/login/google", asyncHandler( UsersController.loginWithGoogle ) );

/**
 * @desc Usuarios
 */
router.post( "/users", asyncHandler( UsersController.addUser ) );
router.post( "/users/profile", asyncHandler( UsersController.updateUser ) );
    
//export default router;
