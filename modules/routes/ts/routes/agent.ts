import { AgentAPI } from '@aimpact/base-agent/agent';

const agent = new AgentAPI();
export /*bundle*/ const execute = async (req, res) => {
    const { text, path } = req.body;
    if (!text) {
        return res.status(400).send({ status: false, error: 'No data to process' });
    }

    console.log('agent http ', text, path);

    try {
        const response = await agent.init(text, path);
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
