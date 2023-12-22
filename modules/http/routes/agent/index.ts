import type { Application, Request, Response } from 'express';
import { BaseAgent } from '@aimpact/base-agent/agent';
import * as dotenv from 'dotenv';

dotenv.config();

const { AGENT_TOKEN } = process.env;

export class AgentRoutes {
	static setup(app: Application) {
		app.post('/agent/messages', this.sendMessage);
	}

	static async sendMessage(req: Request, res: Response) {
		const authHeader = req.headers['authorization'];
		const accessToken = authHeader && authHeader.split(' ')[1];
		if (!accessToken) return res.status(401).json({ error: 'Access token not provided' });
		if (accessToken !== AGENT_TOKEN) {
			return res.status(401).json({ error: 'Access is not allowed. Invalid credentials.' });
		}

		res.setHeader('Access-Control-Allow-Origin', '*');

		if (!req.body) return res.status(400).json({ error: 'Parameters is not an object' });

		const { metadata, chatId, project, synthesis, messages, user, prompt, language } = req.body;
		if (typeof metadata !== 'object') return res.status(400).json({ error: 'Metadata is not an object' });
		if (!chatId) return res.status(400).json({ error: 'chatId must be a specified' });
		if (typeof chatId !== 'string') return res.status(400).json({ error: 'chatId must be a string' });
		if (!project) return res.status(400).json({ error: 'project must be a specified' });
		if (typeof project !== 'string') return res.status(400).json({ error: 'project must be a string' });
		if (synthesis && typeof synthesis !== 'string')
			return res.status(400).json({ error: 'Synthesis must be a string' });
		if (messages && typeof messages !== 'object')
			return res.status(400).json({ error: 'Messages parameter must be an object' });
		if (messages?.last && !(messages.last instanceof Array))
			return res.status(400).json({ error: 'Last messages parameter must be an array' });
		if (typeof user !== 'object' || !user.name)
			return res.status(400).json({ error: 'User parameter must be specified' });
		if (typeof prompt !== 'string') return res.status(400).json({ error: 'Prompt parameter must be specified' });
		if (typeof language !== 'string')
			return res.status(400).json({ error: 'Language parameter must be specified' });
		if (!['es', 'en', 'pt', 'fr', 'it', 'de'].includes(language))
			return res.status(400).json({ error: `Language "${language}" is not supported` });

		const specs = { chatId, project, language, metadata, synthesis, messages, user, prompt };
		const agent = new BaseAgent();
		const iterator = agent.sendMessage(specs);

		res.setHeader('Content-Type', 'text/plain');
		res.setHeader('Transfer-Encoding', 'chunked');

		for await (const { chunk } of iterator) {
			res.write(chunk);
		}

		res.end();
	}
}
