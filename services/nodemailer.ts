// Constantes de configuración
const MAIL_HOST = process.env.MAIL_HOST || null;
const MAIL_PORT = Number(process.env.MAIL_PORT) || 465;
const MAIL_USER = process.env.MAIL_USER || null;
const MAIL_PASS = process.env.MAIL_PASS || null;

// Componentes
import * as nodemailer from "nodemailer";

// Constantes 
import { QUALIFICATIONS } from "../utils/constants"

/**
 * Envia un mail con los datos que se reciben por parametro
 *
 * @param mailData      datos de mail a enviar
 *
 * @return              void
 *
 */
export async function sendMail(review: rossa.reviews.review, answers: rossa.reviews.answer[]): Promise<void> {
 
  // Creamos el objeto con la cuenta de mail de donde saldra el mensaje
  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    ignoreTLS: false
  });

  const qualifications = {
    [QUALIFICATIONS.DISSATISFIED]: "Debe mejorar",
    [QUALIFICATIONS.NEUTRAL]: "Aceptable",
    [QUALIFICATIONS.SATISFIED]: "Muy bueno",
    [QUALIFICATIONS.NO]: "No",
    [QUALIFICATIONS.YES]: "Si"
  }
  

  // Armamos el contenido del mail
  const html = `
    <!DOCTYPE 4email>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body style="margin: 0; padding: 0; min-width: 100%; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased;">
          <div class="main" style="width: 100%;">
              <div class="navbar" style="background-color: #101010; text-align: center;">
                  <img src="https://www.pastarossa.com.ar/wp-content/uploads/2015/09/logo-pasta-rossa-medium-white.png" alt="logo"/>
              </div>
              <div class="container" style="background-color: #ededed;">           
                  <div class="client-info" style="padding: 20px; ">  
                      <h1>Información del cliente:</h1>     
                      <p style="margin: 5px; font-size: 1rem;"><b>Nombre y Apellido:</b> ${ review.name || ''} </p>                                  
                      <p style="margin: 5px; font-size: 1rem;"><b>Fecha de cumpleaños:</b> ${ review.birthdate || ''} </p>
                      <p style="margin: 5px; font-size: 1rem;"><b>Tel/Celular:</b> ${ review.phone || ''} </p>
                      <p style="margin: 5px; font-size: 1rem;"><b>Email:</b> ${ review.email || ''} </p>
                      <p style="margin: 5px; font-size: 1rem;"><b>Sugerencias:</b> ${ review.suggestions || ''} </p>
                  </div>
                  <h1 class="answer" style=" text-align: center; ">Respuestas</h1> 
                  <div style="color: #ededed; width: 700px; margin: auto;">                    
                  ${
                      // Armamos el listado de respuestas del cliente
                      answers.map(( answer, key ) => {                            
                        return `
                        <div class="question-container" style="margin: 20px; background-color: white; border-radius: 50px; color: black;">
                            <p class="question" style=" padding-top: 10px; font-weight: bold; font-size: 1rem; text-align: center;">
                                ${ answer.title }
                            </p> 
                            <p class="question-answer" style="text-align: center; padding-bottom: 10px; font-size: 1rem;">${ qualifications[answer.qualification] }</p> 
                        </div>
                        `                            
                      })
                  }
                  </div>                                         
              </div>
          </div>
      </body>
    </html>
  `;

  // Enviamos el mail con los datos recibidos
  const result = await transporter.sendMail({

    // Direccion de donde sale el email
    from: 'pastarosamailer@nicolasaugustolio.com.ar',
    // Direccion donde se envia
    to: "joaquinlio97@gmail.com",//to: 'pastarossaadrogueencuestas@gmail.com', 
    // Sujeto
    subject: `Reseña de ${review.name || ''}`, 
    // Template del email
    html: html
    
  }, (err, info) => {

    //console.log(info);

    // Si obtuvimos en un error
    if (err) {
      console.error(`nodemailer.ts (sendMail): (${err.stack})`);
    }
  });

  return result;

}

