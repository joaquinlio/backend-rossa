
import { Request, Response } from "express";

/**
 * @desc Network
 */
import * as network from "../network/Users";

/**
 * @desc Utilidades
 */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const response = require("../utils/Response");


/**
 * @desc Controlador de usuarios.
 */

/**
 * Lista usuarios
 * @returns void
 */
export async function login( req: Request, res: Response): Promise<void> {

    try {
                                                               
        // Credenciales de usuario
        const {

            // Email 
            email = null,
    
            // Contraseña
            password = null
    
        } = req.body;
    
    
        // Valido los datos enviados en el Request
        if (email === null || password === null) {
    
            // Lanzamos error            
            return response.error(req, res, `controllers/auth.ts (login): Todos los campos deben ser completados`, 400);   
        }
    
        // Ejecuto la consulta en la base de datos
        const user = await network.getByEmail(email);
    
        // Se verifica si el usuario existe
        if (!user) {    
            // Lanzamos error
            return response.error(req, res, `controllers/auth.ts (login): Credenciales incorrectas`, 401); 
        }
    
        // Compara el password enviado por el front contra el obtenido por la base de datos                 
        const compare = await bcrypt.compare(password, user.password);
              
        if(!compare){
            // Lanzamos error
            return response.error(req, res, `controllers/auth.ts (login): Credenciales incorrectas`, 401);
        }

        // Elimina el password del objeto
        delete user.password;

        // Genera el token
        const token = jwt.sign( user.email, process.env.JWT_SECRET)
                
        return response.success(req, res, { user, token }, 200);
        
    } catch (error) {
        console.log(error);
        return response.error(req, res, `controllers/Reviews.ts (login): error al obtener los usuarios [${error}]`, 500);
    }
}