import mysql from "mysql2/promise"
import * as config from "../config";

// Configuracion
const dbconf = {
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbdatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Propiedades del modulo
let initialized = false;
let pool: mysql.Pool = undefined;

/**
 * @desc Inicia el servicio de acceso a bases de datos
 */
async function start(): Promise<boolean>  {

  // Resultado
  let ret = false;

  try {

    // Si el modulo no fue inicializado
    if (initialized === false) {
      
      // Inicializa el pool de conexiones
      pool = await mysql.createPool(dbconf);

      // Define como inicializado al modulo
      initialized = true;

      ret = true;       
      console.log("DB connected");
                
    }else{
      ret = true;
    }
    
  } catch (error) {
    console.error("[db error]", error);
  }

  return ret;

}

/**
 * @desc Ejecuta una query en la base de datos y retorna el resultado
 */
async function Execute( sql: any, transaction = false): Promise< any > {

    let connection: mysql.PoolConnection
    let ret: Array<mysql.ResultSetHeader>|boolean = false;

    try {

      // Inicializa la conexion con la base de datos
      start();

      // Solicitamos una conexion al pool
      connection = await pool.getConnection();

      // Array para ejecucion de queries
      let queries = [];

      // Si requiere de una transaccion
      if (transaction === true) {
        queries.push("BEGIN;");
      }
      
      // Si es un array
      if (Array.isArray(sql) === true) {
        queries = queries.concat(sql);
      } else {
        queries.push(sql);
      }
      
      // Si requiere de una transaccion
      if (transaction === true) {
        queries.push("COMMIT;");
      }

      // Ejecuta la query/ies
      const results = await bulk(connection, queries);

      if (results === false) {

        ret = false;
  
        // Hace un rollback si esta en una transaccion
        if (transaction === true) {
  
          // Ejecuta la query/ies
          console.warn("db.js (execute): ocurrio un error, se ejecuta un rollback de la transaction");
          await bulk(connection, ["ROLLBACK;"]);
  
        }
  
      } else {      
        ret = results;
      }

     
    } catch (error) {
        console.error(`db.ts (execute): error (${error.stack})`);
    }

    return ret;

}

/**
 * Recibe un array sentencias SQL y las ejecuta en orden, retorna
 * un array con los resultados de cada una
 *
 * @param connection               instancia de la conexion o undefined para crear una nueva
 * @param queries                  lista de queries a ejecutar
 *
 * @return                         resultados de las consultas o false
 *
 */
async function bulk(connection: mysql.PoolConnection, queries: Array<string>): Promise<mysql.ResultSetHeader[]|boolean> {

  const results: Array<mysql.ResultSetHeader> = [];
  let abort = false;

  try {

    if (connection !== undefined) {

      // Function para la ejecucion de una query
      const execute = async function(query: string): Promise<any> {

        try {

          // Ejecuta la consulta
          const [rows] = await connection.query(query);
        
          return rows;

        } catch (err) {
          console.error(`db.ts (bulk/execute): error (${err.message}) [${query}]`);
        }

      };

      // Ejecuta el set de consultas
      for (let i = 0; i < queries.length; i++) {

        const result = await execute(queries[i]);
        if (result !== undefined) {

          // Agrega el resultado
          results.push(result);

        } else {
          abort = true;
          break;
        }

      }

    } else {
      console.error("db.ts (bulk): la instancia de la conexion a base de datos es invalida");
    }

  } catch(err) {
    console.error(`db.ts (bulk): error (${err.stack})`);
  }

  // Si se aborta la ejecucion
  if (abort === true) {
    return false;
  } else {
    connection.release()
    return results;
  }

}

export default{
  start,
  Execute
}

