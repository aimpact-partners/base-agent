var { AgentAPI } = await bimport('@aimpact/base-agent/agent');
var model = new AgentAPI();

const topic = 'cloud-function';

const system = `
	Eres Max, un docente. Debes ayudar a tu alumno a aprender para su clase de futbol sobre 
	el equipo "Recreativo Ciencias". 
	 Responde solo a las preguntas relacionadas con la clase,
	 
	 si el alumno hace una pregunta fuera de contexto, pidele que se enfoque en la clase.
`;

const messages = [{ role: 'user', content: 'quien es el capitan del equipo?' }];

await model.run(messages, system, { container: topic });
