
import { Request, Response } from "express";

/**
 * @desc Network
 */
import * as network from "../network/Users";
import bcrypt from "bcrypt"
/**
 * @desc Utilidades
 */
 import * as response from "../utils/Response";

/**
 * @desc Controlador de usuarios.
 */

/**
 * Lista usuarios
 * @returns void
 */
export async function getUsers( req: Request, res: Response): Promise<void> {

    try {
                                                               
        // Obtiene los usuarios de la base de datos
        const users = await network.getUsers()

        if(!users)
            return response.error(req, res, `controllers/Reviews.ts (getUsers): error al obtener los usuarios`, 500);          

        return response.success(req, res, users, 200);
        
    } catch (error) {
        console.log(error);
        return response.error(req, res, `controllers/Reviews.ts (getUsers): error al obtener los usuarios [${error}]`, 500);
    }
}

/**
 * Añade un usuario
 * @returns void
 */
 export async function addUser( req: Request, res: Response): Promise<void> {

    try {
                                                               
        // alias de la data
        let {
            username,
            email,
            password
        } = req.body;

        // Valida el nombre
        if(!username)
            return response.error(req, res, "username es un parametro requerido", 400);

        // Valida el email
        if(!email)
            return response.error(req, res, "email es un parametro requerido", 400);

        // Valida el password
        if(!password)
            return response.error(req, res, "password es un parametro requerido", 400);            

        // Verifica si el usuario ya existe
        const user = await network.getByEmail(email);

        if( user )
            return response.error(req, res, `ya existe un usuario con este email ${email}`, 400);

        // Encripta el password
        password = await bcrypt.hash(password, 5);
        
        // Ejecuta una Query
        const addUser = await network.addUser(username, email, password)

        if(!addUser)
            return response.error(req, res, `error al crear el usuario ${username} ${email}`, 500);                              

        return response.success(req, res, addUser, 200);
        
    } catch (error) {
        console.log(error);
        return response.error(req, res, `controllers/Reviews.ts (getUsers): error al obtener los usuarios [${error}]`, 500);
    }
}
