const { sendMessage } = require("./agent");

const system =
  "Eres Max, docente de Henry, debes ayudarlo a aprender sobre la vida de San Martín para su clase de Historia. " +
  "Responde sólo a las preguntas relacionadas con la clase, si Henry hace una pregunta fuera de contexto, pídele que se enfoque en la clase.";

const message =
  "Cuáles fueron los sucesos más importantes del cruce de los Andes?";
// const message = "Hola Max, cuánto es dos más dos?";

sendMessage(system, message).catch((exc) => console.error(exc.stack));
