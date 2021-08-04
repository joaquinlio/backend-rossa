// Utilidades
import db from "../services/db";
import * as nodemailer from "../services/nodemailer"

// Constantes 
import { QUALIFICATIONS, STORES } from "../utils/constants"

/**
 * @desc Añade una reseña
 *
 * @param review          reseña
 * 
 * @return                true o false
 *
 */
export async function addReview( review: rossa.reviews.review ) : Promise<boolean | number>{
        
    try {

        // Sentencia Sql
        let sql = `
            INSERT INTO
                reviews (store, name, birthdate, phone, email, suggestions)            
                    VALUES (                    
                        '${ review.store}',
                        '${ review.name}',
                        '${ review.birthdate}',
                        '${ review.phone}',
                        '${ review.email}',
                        '${ review.suggestions}'
                    )
                    `;
                    
        // Ejecuta la consulta
        const result = await db.Execute(sql);
                     
        // Ejecuta la consulta
        if (result) {
            
            // Retorna el id de la reseña añadida
            return result[0].insertId;

        } else {
            console.error("Reviews.js (addReview): ocurrio un error al insertar el registro");
            
            return false
        }
    } catch(err) {
        console.error(`Reviews.js (addReview): error (${err.stack})`);
       
        return false;
    }
}

/**
 * @desc Guarda las respuestas del cliente
 *
 * @param review          reseña
 * 
 * @return                true o false
 *
 */
 export async function saveAnswers( answers: rossa.reviews.answer[], reviewId: number | boolean ) : Promise<boolean | number>{
        
    try {

        // Sentencia Sql
        let sql = [];

        for (const answer of answers) {

            sql.push(`
            INSERT INTO
            answers (
                review_id,
                question,
                qualification
            )            
            VALUES (                    
                '${ reviewId }',
                '${ answer.title}',
                '${ answer.qualification}'
            );
            `);           
        }

        // Ejecuta la consulta
        const result = await db.Execute(sql, true);
                     
        // Ejecuta la consulta
        if (result) {
            
            return true;

        } else {
            console.error("Reviews.js (saveAnswers): ocurrio un error al insertar el registro");
            
            return false
        }
    } catch(err) {
        console.error(`Reviews.js (saveAnswers): error (${err.stack})`);
       
        return false;
    }
}

/**
 * @desc Envia el email 
 *
 * @param review          reseña
 * 
 * @return                true o false
 *
 */
 export async function sendEmail( review: rossa.reviews.review, answers: rossa.reviews.answer[], to: string ) : Promise<boolean | number>{
        
    try {

        // Envio del email
        const result = nodemailer.sendMail(review, answers, to)
                     
        // Ejecuta el envio
        if (result) {
            
            return true;

        } else {
            console.error("Reviews.js (sendEmail): ocurrio un error al enviar el email");
            
            return false
        }
    } catch(err) {
        console.error(`Reviews.js (sendEmail): error (${err.stack})`);
       
        return false;
    }
}

/**
 * @desc Obtiene todas las reseñas 
 *
 * @param review          reseña
 * 
 * @return                true o false
 *
 */
 export async function getAll( dateFrom: string, dateTo: string, store: string ) : Promise<rossa.reviews.review[] | boolean>{
        
    try {

        // Sentencia Sql
        let sql = `
            SELECT 
                *
            FROM 
                reviews
            WHERE                
                date BETWEEN '${dateFrom}' AND '${dateTo}'
        `;

        if(store !== STORES.ALL){
            sql += ` AND store = '${store}'`
        }
                   
        // Ejecuta la consulta
        const result = await db.Execute(sql);
                     
        // Ejecuta el envio
        if (result) {

            // Asigna los datos
            const reviews = result[0];

            // Sentencia Sql
            let sqlAnswers = `
                SELECT 
                    review_id as reviewId,
                    question,
                    qualification
                FROM 
                    answers
                LEFT JOIN
                    reviews ON reviews.id = answers.review_id                 
            `;

            if(store !== STORES.ALL){
                sql += ` WHERE
                            reviews.store = '${store}'`
            }
                
            // Ejecuta la consulta
            const resultAnswers = await db.Execute(sqlAnswers);

            // Asigna los datos
            const answers = resultAnswers[0]
            
            // Recorre las reseñas y le asignas las respuestas 
            reviews.forEach((review: rossa.reviews.review) => {

                const reviewAnswers = answers.filter( (answer: rossa.reviews.answer) => answer.reviewId === review.id);

                review.answers = reviewAnswers
                review.average = calculateAverage( reviewAnswers )
            });
           
            return reviews;

        } else {
            console.error("Reviews.js (getAll): ocurrio un error al obtener las reseñas");
            
            return false
        }
    } catch(err) {
        console.error(`Reviews.js (getAll): error (${err.stack})`);
       
        return false;
    }
}

/**
 * @desc Calcula el promedio de calificacion que tuvo la reseña
 *
 * @param review          reseña
 * 
 * @return                true o false
 *
 */
 function calculateAverage( reviewAnswers: rossa.reviews.answer[] ) : rossa.reviews.average | boolean {
        
    try {

        let counts: any = {
            dissatisfied: 0,
            neutral: 0,
            satisfied: 0
        }

        //LA OPCION MAS ELEJIDA/ TODOS LOS VOTOS * 100
        for (const answer of reviewAnswers) {

            switch (answer.qualification) {
                case QUALIFICATIONS.DISSATISFIED:
                    counts.dissatisfied++  
                    break; 
                case QUALIFICATIONS.NEUTRAL:
                    counts.neutral++  
                    break;
                case QUALIFICATIONS.SATISFIED:
                    counts.satisfied++  
                    break;
                case QUALIFICATIONS.YES:
                    counts.satisfied++ 
                    break;
                case QUALIFICATIONS.NO:
                    counts.dissatisfied++   
                    break;                                   
            }

        }

        const mostChosenOption: string = Object.entries(counts).reduce((m, c) => m[1] > c[1] ? m: c)[0];
               
        return {
            percent: Math.round((counts[mostChosenOption] / reviewAnswers.length) * 100),
            qualification: mostChosenOption.toUpperCase()
        };

    } catch(err) {
        console.error(`Reviews.js (calculateAverage): error (${err.stack})`);
       
        return false;
    }
}

/**
 * @desc Obtiene una reseña 
 *
 * @param review          reseña
 * 
 * @return                true o false
 *
 */
 export async function get( reviewId: string ) : Promise<rossa.reviews.review[] | boolean>{
        
    try {

        // Sentencia Sql
        let sql = `
            SELECT 
            *
            FROM reviews
            WHERE id = ${ reviewId }
            ;
        `;
                    
        // Ejecuta la consulta
        const result = await db.Execute(sql);
                     
        // Ejecuta el envio
        if (result) {

            // Asigna los datos
            const review = result[0][0];

            // Sentencia Sql
            let sql = `
                SELECT 
                    review_id as reviewId,
                    question,
                    qualification
                FROM answers
                WHERE review_id = ${ reviewId }
                ;
            `;
                        
            // Ejecuta la consulta
            const resultAnswers = await db.Execute(sql);

            review.answers = resultAnswers[0]
           
            return review;

        } else {
            console.error("Reviews.js (get): ocurrio un error al obtener la reseña");
            
            return false
        }
    } catch(err) {
        console.error(`Reviews.js (get): error (${err.stack})`);
       
        return false;
    }
}

/**
 * @desc Obtiene el email del local 
 *
 * @param store          local
 * 
 * @return                true o false
 *
 */
 export async function getStoreEmail( store: string ) : Promise<string>{
        
    try {

        // Sentencia Sql
        let sql = `
            SELECT 
                email
            FROM stores
            WHERE name = '${ store }'
            ;
        `;
                    
        // Ejecuta la consulta
        const result = await db.Execute(sql);
                     
        // Ejecuta el envio
        if (result) {            
            
            // Asigna los datos
            const store = result[0][0];

            return store.email;

        } else {
            console.error("Reviews.js (get): ocurrio un error al obtener la reseña");                        
        }
    } catch(err) {
        console.error(`Reviews.js (get): error (${err.stack})`);               
    }
}




 
