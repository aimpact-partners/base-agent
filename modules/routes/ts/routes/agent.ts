import {AgentAPI} from '@aimpact/base-agent/agent';

const agent = new AgentAPI();
export /*bundle*/ const execute = async (req, res) => {
	const {text} = req.body;
	if (!text) {
		return res.status(400).send({status: false, error: 'No data to process'});
	}

	try {
		const response = await agent.init(text);
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
		res.status(500).send('Error processing request');
	}
};
