import { AgentAPI } from '@aimpact/base-agent/agent';

const agent = new AgentAPI();
export /*bundle*/ const execute = async (req, res) => {
	const { prompt, messages, filter, token } = req.body;

	if (token !== process.env.GCLOUD_INVOKER) {
		return res.status(400).send({ status: false, error: 'Token request not valid' });
	}

	if (!messages) {
		return res.status(400).send({ status: false, error: 'No data to process' });
	}

	try {
		const response = await agent.run(messages, prompt, filter);
		if (!response.status) {
			res.json({
				status: false,
				error: `Error processing: ${response.error}`,
			});
			return;
		}
		return res.json(response);
	} catch (error) {
		console.error(error);
		res.json({
			status: false,
			error: error.message,
		});
	}
};
