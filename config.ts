  import { config } from 'dotenv';

  /**
 * @desc Importación de las variables de entorno.
*/
  config()

  const apiPort: number = parseInt(process.env.PORT) || 3000;
  const jwtsecret: string = process.env.JWT_SECRET || "rossa2020**";
  
  
  const dbhost: string = process.env.MYSQL_HOST || "localhost";
  const dbuser: string = process.env.MYSQL_USER || "root";
  const dbpassword: string = process.env.MYSQL_PASS || "";
  const dbdatabase: string = process.env.MYSQL_DB || "rossadb";
  

  export {
    apiPort,
    jwtsecret,
    dbhost,
    dbuser,
    dbpassword,
    dbdatabase
  };

