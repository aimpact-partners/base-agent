import { agent } from './agent';

export /*bundle*/
function routes(app) {
	app.get('/', (req, res) => res.send('@aimpact/base-agent http server'));
	app.post('/agent', agent);
}
