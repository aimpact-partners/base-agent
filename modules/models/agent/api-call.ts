import config from '@aimpact/base-agent/config';
import * as dotenv from 'dotenv';
dotenv.config();

const options = {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
};

export const call = async (params: {}) => {
	try {
		const URL = `${config.params.chatAPI}/kb/search`;
		params = { ...params, token: process.env.GCLOUD_INVOKER };

		const specs = { ...options, body: JSON.stringify(params) };
		const response = await fetch(URL, specs);

		return await response.json();
	} catch (e) {
		console.error(e);
		const code = e.message.includes('401') ? 401 : 500;
		return { status: false, error: e.message, code };
	}
};
