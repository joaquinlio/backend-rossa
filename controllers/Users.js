/**
 * @desc Utilidades
 */
const response = require("../utils/Response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
/**
 * @desc Network
 */
const network = require("../network/Users");
const config = require("../config");

/**
 * @desc Controlador de lol.
 */
export default class UsersController {

    // Añade un usuario
    static async addUser( req, res){

        try {
            // alias de la data
            const {
                name,
                email,
                password,
                avatar
            } = req.body;

            // Valida el nombre
            if(!name)
                return response.error(req, res, "name is a param required", 400);

            // Valida el email
            if(!email)
                return response.error(req, res, "email is a param required", 400);
            
            // Valida el password
            if(!password)
                return response.error(req, res, "password is a param required", 400);            
            
            // Verifica si el usuario ya existe
            const user = await network.getUser('email', email);
          
            if( user.result )
                return response.error(req, res, `there is already a user with this email ${name} ${email}`, 400);

            // Ejecuta una Query
            const addUser = await network.addUser(name, email, password, avatar)

            if(!addUser.result)
                return response.error(req, res, `failed when create the user ${name} ${email}`, 500);  

            // Genera el token
            const token = jwt.sign( email, config.jwt.secret)

            // Datos del usuario para retornar
            const dataUser = {
                id: addUser.data.insertedId,
                name: name,
                email: email,                
                avatar: avatar 
            };

            const result = {
                token,
                user: dataUser,
                profileComplete: false          
            }

            return response.success(req, res, result, 200);
            
        } catch (error) {
            console.log(error);
            return response.error(req, res, `Internal Server Error [${error}]`, 500);
        }
    }

    // Logeo
    static async login( req, res){
        try {

            // alias de la data
            const {       
                email,
                password            
            } = req.body; 

            // Valida el email
            if(!email)
                return response.error(req, res, "email is a param required", 400);

            // Valida el password
            if(!password)
                return response.error(req, res, "password is a param required", 400);

            // Obtiene un usuario
            const user = await network.getUser('email', email);
           
            if(!user.result)
                return response.error(req, res, `failed get user ${email}`, 500);                               
     
            // Compara el password enviado por el front contra el obtenido por la base de datos                 
            const compare = await bcrypt.compare(password, user.data.password);
                      
            if(!compare)
                return response.error(req, res, `email or password incorrect`, 401);
            
            // Genera el token
            const token = jwt.sign( user.data.email, config.jwt.secret)

            // Datos del usuario para retornar
            const dataUser = {
                id: user.data.id,
                name: user.data.name,
                email: user.data.email,
                category: user.data.category,
                birthdate: user.data.birthdate,
                gender: user.data.gender,
                phone: user.data.phone,
                country: user.data.country,
                avatar: user.data.avatar 
            };

            let profileComplete = true;

            // Recorremos los datos del usuario para verificar si tiene completo el perfil
            Object.keys( dataUser ).forEach(( key ) => {
                
                if( !dataUser[key] || dataUser[key] === undefined)
                    profileComplete = false;

            });

            const result = {
                token,
                user: dataUser,
                profileComplete            
            }

            // RETORNAR TOKEN
            return response.success(req, res, result , 200);

        } catch (error) {
            console.log(error);
            return response.error(req, res, `Internal Server Error [${error}]`, 500);
        }
    }

    // Añade la informacion del perfil
    static async updateUser( req, res){

        try {
            // alias de la data
            const {  
                userId,     
                name,
                category,
                birthdate,
                gender,
                phone,
                country,
                avatar           
            } = req.body; 

            // Valida el id del usuario
            if(!userId)
                return response.error(req, res, "userId is a param required", 400);
            // Valida el nombre
            if(!name)
                return response.error(req, res, "name is a param required", 400);
            // Valida la categoria
            if(!category)
                return response.error(req, res, "category is a param required", 400);
            // Valida la fecha de nacimiento
            if(!birthdate)
                return response.error(req, res, "birthdate is a param required", 400);
            // Valida el genero
             if(!gender)
                return response.error(req, res, "gender is a param required", 400);                
            // Valida el telefono
            if(!phone)
                return response.error(req, res, "phone is a param required", 400);    
            // Valida el pais
            if(!country)
                return response.error(req, res, "country is a param required", 400); 
            
            const updateUser = await network.updateUser(userId, name, category, birthdate, gender, phone, country, avatar)

            if(!updateUser.result)
                return response.error(req, res, `failed when update the user ${userId} ${name}`, 500); 

            return response.success(req, res, true , 200);

        } catch (error) {
            console.log(error);
            return response.error(req, res, `Internal Server Error [${error}]`, 500);
        }
    }

    // Ingrea un usuario con la informacion de google
    static async loginWithGoogle( req, res){

        try {
           // alias de la data
            const {
                name,
                email,
                password,
                avatar
            } = req.body;

            // Valida el nombre
            if(!name)
                return response.error(req, res, "name is a param required", 400);

            // Valida el email
            if(!email)
                return response.error(req, res, "email is a param required", 400);
            
            // Valida el password
            if(!password)
                return response.error(req, res, "password is a param required", 400);

            // Verifica si el usuario ya existe
            const user = await network.getUser('email', email);

            if( user.result ){
                // Compara el password enviado por el front contra el obtenido por la base de datos                 
                const compare = await bcrypt.compare(password, user.data.password);
                        
                if(!compare)
                    return response.error(req, res, `email or password incorrect`, 401);
                
                // Genera el token
                const token = jwt.sign( user.data.email, config.jwt.secret)

                // Datos del usuario para retornar
                const dataUser = {
                    id: user.data.id,
                    name: user.data.name,
                    email: user.data.email,
                    category: user.data.category,
                    birthdate: user.data.birthdate === '0000-00-00' ? null : user.data.birthdate,
                    gender: user.data.gender,
                    phone: user.data.phone,
                    country: user.data.country,
                    avatar: user.data.avatar 
                };

                let profileComplete = true;

                // Recorremos los datos del usuario para verificar si tiene completo el perfil
                Object.keys( dataUser ).forEach(( key ) => {
                    
                    if( !dataUser[key] || dataUser[key] === undefined)
                        profileComplete = false;

                });

                const result = {
                    token,
                    user: dataUser,
                    profileComplete            
                }

                // RETORNAR TOKEN
                return response.success(req, res, result , 200);
            }else{
                // Ejecuta una Query
                const addUser = await network.addUser(name, email, password, avatar)

                if(!addUser.result)
                    return response.error(req, res, `failed when create the user ${name} ${email}`, 500);  

                // Genera el token
                const token = jwt.sign( email, config.jwt.secret)

                // Datos del usuario para retornar
                const dataUser = {
                    id: addUser.data.insertedId,
                    name: name,
                    email: email,                
                    avatar: avatar 
                };

                const result = {
                    token,
                    user: dataUser,
                    profileComplete: false          
                }

                return response.success(req, res, result, 200);
            }

        } catch (error) {
            console.log(error);
            return response.error(req, res, `Internal Server Error [${error}]`, 500);
        }
    }

}