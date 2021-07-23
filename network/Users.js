// db 
const db = require("../services/db");

const bcrypt = require("bcrypt");

/**
 * @desc Añade un usuario
 *
 * @param name            nombre del usuario
 * @param email           email del usuario 
 * @param password        password del usuario 
 * @param category        categoria del usuario 
 * 
 * @return                true o false
 *
 */
export default async function addUser(name, email, password, avatar){

    const response = {
        result: false,
        data: null
    };
    
    try {

        // Encripta el password
        password = await bcrypt.hash(password, 5);
        
        // Sentencia Sql
        let sql = `
            INSERT INTO
                users (name, email, password, avatar)            
                    VALUES (                    
                        '${name}',
                        '${email}',
                        '${password}',
                        '${avatar}'
                    )`;
                    
        // Ejecuta la consulta
        const result = await db.Execute(sql);
                     
        // Ejecuta la consulta
        if (result !== false && result.insertId) {
            response.result = true;
            response.data = { insertedId: result.insertId }
        } else {
            console.error("Users.js (addUser): ocurrio un error al insertar el registro");
            response.errcode = 0;
            response.errmsg = `error, no se pudo insertar el usuario por un error interno del servicio (${email}, ${name})`;
        }
    } catch(err) {
        console.error(`Users.js (addUser): error (${err.stack})`);
        response.errcode = 500;
        response.errmsg = `error, no se pudo insertar el usuario por un error interno del servicio (${email}, ${name})`;
    }
    
    return response;

}

/**
 * @desc Logeo del usuario
 *
 * @param column        columna para la busqueda
 * @param value         valor del campo a buscar
 * 
 * @return                true o false
 *
 */
export default async function getUser(column, value){

    const response = {
        result: false,
        data: null
    };
    
    try {

        // Sentencia Sql
        let sql = `
            SELECT * FROM users WHERE ${column}='${value}'
        `;
                
        // Ejecuta la consulta
        let result = await db.Execute(sql);
                         
        // Valida el resultado 
        if (result) {

            // Parcea el resultado 
            result = JSON.parse(JSON.stringify(result[0]));

            response.result = true;

            response.data = result;
        }    
    } catch(err) {
        //console.error(`Users.js (getUser): error (${err.stack})`);
        response.errcode = 500;
        response.errmsg = `error, no se pudo verificar el usuario por un error interno del servicio (${column}, ${value})`;
    }
    
    return response;

}

/**
 * @desc Actualiza informacion del usuario
 *
 * 
 * @return                true o false
 *
 */
export default async function updateUser( userId, name, category, birthdate,gender, phone, country, avatar){
    const response = {
        result: false
    };
    
    try {        
        
        // Sentencia Sql
        let sql = `
            UPDATE users
                SET name = '${name}', category = '${category}', birthdate = '${birthdate}', gender = '${gender}', phone = '${phone}', country= '${country}', avatar = '${avatar}'           
                WHERE id = ${userId}`;
                    
        // Ejecuta la consulta
        const result = await db.Execute(sql);
       
        // Ejecuta la consulta
        if (result !== false) {

            const user = this.getUser('id', userId);

            if( user.result ){

                response.result = true;
                response.data = user.data;

            }else{

                console.error("Users.js (updateUser): ocurrio un error al obtener el regristro actualizado");
                response.errcode = 0;
                response.errmsg = `error,ocurrio un error al obtener el regristro actualizado (${userId}, ${name})`;
            }

        } else {
            console.error("Users.js (updateUser): ocurrio un error al actualizar el registro");
            response.errcode = 0;
            response.errmsg = `error, no se pudo actualizar el usuario por un error interno del servicio (${userId}, ${name})`;
        }
    } catch(err) {
        console.error(`Users.js (updateUser): error (${err.stack})`);
        response.errcode = 500;
        response.errmsg = `error, no se pudo actualizar el usuario por un error interno del servicio (${userId}, ${name})`;
    }
    
    return response;
}