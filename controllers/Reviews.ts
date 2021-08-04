
import { Request, Response } from "express";

/**
 * @desc Network
 */
import * as network from "../network/Reviews";

/**
 * @desc Utilidades
 */
 const response = require("../utils/Response");

/**
 * @desc Controlador de reseñas.
 */

// Añade una reseña
export async function addReview( req: Request, res: Response): Promise<void> {

    try {

        // Valido los datos enviados en el Request
        const validation = verify(req, res);
        
        if( validation.haveError )
            return response.error(req, res, validation.message, 400);

        // alias de la data
        const {
            store,
            name,
            birthdate,
            phone,
            email,
            suggestions,
            answers
        } = req.body;

        const Review: rossa.reviews.review = {
            store,
            name,
            birthdate,
            phone,
            email,
            suggestions, 
        }
                                                        
        // Guarda la reseña en la base de datos
        const addReview = await network.addReview(Review)

        if(!addReview)
            return response.error(req, res, `controllers/Reviews.ts (addReview): error al insertar una reseña`, 500);  
        
        // Guarda las respuesta del cliente en la base de datos
        const saveAnswers = await network.saveAnswers(answers, addReview);

        if(!saveAnswers)
            return response.error(req, res, `controllers/Reviews.ts (addReview): error al insertar las respuestas del cliente`, 500);

        // Obtenemos el mail del local
        const storeEmail = await network.getStoreEmail( Review.store )

        if( storeEmail ){
            // Envio del email con el resultado de la reseña 
            await network.sendEmail(Review, answers, storeEmail);
        }
                
        // Respuesta
        return response.success(req, res, addReview, 200);
        
    } catch (error) {
        console.log(error);
        return response.error(req, res, `controllers/Reviews.ts (addReview): error al insertar una reseña [${error}]`, 500);
    }
}

// Verifica los datos
function verify( req: Request, res: Response): rossa.httpResponses.errorForm {

    try {

        // alias de la data
        const {
            store_id,
            name,
            birthdate,
            phone,
            email,
            suggestions,
        } = req.body;

        // Valida el store id
        if(!store_id)
        return { haveError: false, message: "store is a param required"}; 

        // Valida el nombre
        if(!name)
        return { haveError: false, message: "name is a param required"};
        
        // Valida el fecha de nacimiento
        if(!birthdate)
        return { haveError: false, message: "birthdate is a param required"}; 

        // Valida el telefono
        if(!phone)
        return { haveError: false, message: "phone is a param required"}; 
        
        // Valida el email
        if(!email)
        return { haveError: false, message: "email is a param required"}; 

        // Valida el sugerencias
        if(!suggestions)
        return { haveError: false, message: "suggestions is a param required"};  

    } catch (error) {
        console.log(error);
        return { haveError: false, message: `Internal Server Error [${error}]`}
    }
}

// Obtiene las reseñas
export async function getReviews( req: Request, res: Response): Promise<void> {

    try {

        // Datos del request
        let store = req.query.store as string;
        let dateFrom = req.query.dateFrom as string;
        let dateTo = req.query.dateTo as string;

         // Verifica los parametros requeridos
        if ( !store || !dateFrom || dateFrom.length !== 8 || !dateTo || dateTo.length !== 8 ) {
           
            // Envia la respuesta
            return response.error(req, res, `controllers/Reviews.ts (getReviews): parametros invalidos`, 400);     

        }

        // Formatea las fechas 
        dateFrom = `${dateFrom.slice(0, 4)}-${dateFrom.slice(4, 6)}-${dateFrom.slice(6, 8)} 00:00:00`;
                       
        dateTo = `${dateTo.slice(0, 4)}-${dateTo.slice(4, 6)}-${dateTo.slice(6, 8)} 23:59:59`;

        // Guarda la reseña en la base de datos
        const reviews = await network.getAll(dateFrom, dateTo, store)

        if(!reviews)
            // Envia la respuesta
            return response.error(req, res, `controllers/Reviews.ts (getReviews): error al insertar una reseña`, 500);  
                        
        // Envia la respuesta
        return response.success(req, res, reviews, 200);
        
    } catch (error) {
        console.log(error);
        return response.error(req, res, `controllers/Reviews.ts (getReviews): error al insertar una reseña [${error}]`, 500);
    }
}

// Añade un usuario
export async function getReview( req: Request, res: Response): Promise<void> {

    try {

        // id del proveedor
        const {
            id = null
        } = req.params;
  
        // Valido que el request contenga el id
        if (id === null) {
    
            // Lanzamos error
            return response.error(req, res, `controllers/Reviews.ts (getReview): el parametro id es requerido`, 400);
        }

        // Guarda la reseña en la base de datos
        const review = await network.get(id)

        if(!review)
            return response.error(req, res, `controllers/Reviews.ts (getReview): error obtener una reseña`, 500);  
                        
        // Respuesta
        return response.success(req, res, review, 200);
        
    } catch (error) {
        console.log(error);
        return response.error(req, res, `controllers/Reviews.ts (getReview): error obtener una reseña [${error}]`, 500);
    }
}
