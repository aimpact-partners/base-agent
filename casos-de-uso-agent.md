var { AgentAPI } = await bimport('@aimpact/base-agent/agent');
var model = new AgentAPI();

const topic = "tendencias-educativas"
const system =
`Eres Max, un docente.
  Debes ayudar a tu alumno a aprender para su clase de: "${topic}"".
   Responde solo a las preguntas relacionadas con la clase "${topic}", si el alumno hace una pregunta fuera de contexto, pidele que se enfoque en la clase.`;

const messages =[
{role: 'user', content: "cuales son las tendencias del 2023?"}
];

await model.run(messages, system, {container: topic});
