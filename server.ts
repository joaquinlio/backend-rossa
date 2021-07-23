// Componentes
import express from "express";
import fs from "fs";
import path from "path";
import DotEnv from "dotenv";
import db from "./services/db";
import bodyParser from "body-parser";
/**
 * @desc Importación de las variables de entorno.
*/

DotEnv.config({ 
    path: path.resolve(process.cwd(), 'dev.env' )     
});

const app = express();

const port = process.env.APP_PORT || 3001;

// CORS
app.use( (req, res, next) =>{
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');


  // Intercepts OPTIONS method
  if ("OPTIONS" === req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }

});

// BodyParser
app.use(bodyParser.json());

try {
    
    // Constantes
    const _BASEDIR_ = path.dirname(__filename);

    //Define las rutas de la API
    fs.readdirSync(path.join(_BASEDIR_,"routes")).forEach(async function(name) {
      
      const route = name.trim();
      
      //Obtenemos solos los scripts con extension js, evitamos los .map y obviamos el script principal.
      if(route.includes(".js") && !route.includes(".map") &&  !route.includes("index.js")){

        //Obtenemos el endpoint
        const endpoint = route.replace(".js","");

        //Importamos la ruta
        const importRoute = await import(`./routes/${endpoint}`);
        app.use(importRoute.default);

      }
 
    });

} catch (err) {

    if (err.code === "ENOENT") {
        console.warn("server.js (start): [API] no existen rutas adicionales definidas");
    } else {
        console.error(`server.js (start): (${err.stack})`);
    }
}



// Inicializa la conexion con la base de datos
try {
  db.start(); 
} catch (error) {
  console.error(`server.js (start): (${error.stack})`);
}

app.listen(port, () => console.log("server corriendo en " + port));
