// db 
import db from "../services/db";


/**
 * @desc Lista los usuarios
 *
 */
export async function getUsers() : Promise<boolean | rossa.users.user[]>{
        
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
            console.error("Users.js (getUsers): ocurrio un error al obtener los usuarios");
            
            return false
        }
    } catch(err) {
        console.error(`Users.js (getUsers): error (${err.stack})`);
       
        return false;
    }
}

/**
 * @desc Retorna el usuario segun el id
 *
 */
 export async function getUser( id: string) : Promise<boolean | rossa.users.user>{
        
  try {

      // Sentencia Sql
      let sql = `
          SELECT 
              *
          FROM users
          WHERE id = ${id}
      `;
                  
      // Ejecuta la consulta
      let result = await db.Execute(sql);
                   
      // Ejecuta la consulta
      if (result) {
      
          return result[0];

      } else {
          console.error("Users.js (getUser): ocurrio un error al obtener el usuario");
          
          return false
      }
  } catch(err) {
      console.error(`Users.js (getUser): error (${err.stack})`);
     
      return false;
  }
}

/**
 * Retorna el usuario con el email recibido por parametro
 *
 * @param email           email
 *
 * @return                datos de usuario o undefined
 *
 */
export async function getByEmail(email: string): Promise<rossa.users.user | undefined> {

    try {
  
      // Creamos la consulta
      const sql = `
        SELECT
              id,
              username,
              password,
              email,
              store 
          FROM
               users             
         WHERE email = '${email}'          
        ;`
        ;
  
          
      // Ejecuta la consulta
      let result = await db.Execute(sql);
        
      // Verifico si no hay resultados
      if (result === false || result[0].length === 0) {
  
        // Lanzamos error
        console.error("Se produjo un error al obtener el usuario");

        return undefined;
      }
          
      // Asigna los resultados
      const row = result[0][0];    

      const user: rossa.users.user = {
        id: row.id,
        username: row.username,
        password: row.password,
        email: row.email,
        store: row.store
      };
      
      // Respondemos la solicitud
      return user;

    } catch (error) {
  
      console.error(`(getByEmail): Se produjo un error al realizar la operación (${error.stack})`);
  
      // Respondemos la solicitud
      return undefined;
    }
  
}

/**
 * Retorna el usuario con el email recibido por parametro
 *
 * @param email           email
 *
 * @return                datos de usuario o undefined
 *
 */
export async function addUser(username: string, email: string, password: string): Promise<boolean | undefined> {

  try {

      // Sentencia Sql
      let sql = `
        INSERT INTO
          users (username, email, password)            
              VALUES (                    
            '${username}',
            '${email}',
            '${password}'
        )`;
          
    // Ejecuta la consulta
    const result = await db.Execute(sql);
    
    // Ejecuta la consulta
    if (result) {
          
      // Retorna el id de la reseña añadida
      return true;

    } else {
        console.error("Reviews.js (addUser): ocurrio un error al insertar el usuario");
        
        return false
    }

  } catch (error) {

    console.error(`(addUser): Se produjo un error al realizar la operación (${error.stack})`);

    // Respondemos la solicitud
    return undefined;
  }

}


