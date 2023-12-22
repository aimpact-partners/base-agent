import type { Application, Request, Response } from 'express';
import { AgentRoutes } from './agent';

export /*bundle*/ class Routes {
	static setup(app: Application) {
		app.get('/', (req: Request, res: Response) => res.send('AImpact Base Agents http server'));

		AgentRoutes.setup(app);
	}
}
