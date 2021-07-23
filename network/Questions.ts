// db 
import db from "../services/db";


/**
 * @desc Lista las preguntas
 *
 */
export async function getQuestions() : Promise<boolean | rossa.questions.question[]>{
        
    try {

        // Sentencia Sql
        let sql = `
            SELECT 
                *
            FROM questions
        `;
                    
        // Ejecuta la consulta
        let result = await db.Execute(sql);
                     
        // Ejecuta la consulta
        if (result) {
        
            return result[0];

        } else {
            console.error("Reviews.js (addReview): ocurrio un error al insertar el registro");
            
            return false
        }
    } catch(err) {
        console.error(`Reviews.js (addReview): error (${err.stack})`);
       
        return false;
    }
}