import {AgentAPI} from '@aimpact/base-agent/agent';

const agent = new AgentAPI();
export const execute = async (req, res) => {
	const {query} = req.body;
	if (!query) {
		return res.status(400).send({status: false, error: 'No data to process'});
	}

	try {
		const response = await agent.init(query);
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
