// db 
import db from "../services/db";

//import bcrypt from "bcrypt";

/**
 * @desc Lista las preguntas
 *
 */
export async function login() : Promise<boolean | rossa.users.user[]>{
        
    try {

        // Sentencia Sql
        let sql = `
            SELECT 
                *
            FROM users
        `;
                    
        // Ejecuta la consulta
        let result = await db.Execute(sql);
                     
        // Ejecuta la consulta
        if (result) {
        
            return result[0];

        } else {
            console.error("Users.js (login): ocurrio un error al obtener los usuarios");
            
            return false
        }
    } catch(err) {
        console.error(`Users.js (login): error (${err.stack})`);
       
        return false;
    }
}