import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { EmbeddingAPI } from '@aimpact/base-agent/embedding';
import { functions } from './functions';

interface IUsageSpecs {
	completion_tokens: number;
	prompt_tokens: number;
	total_tokens: number;
}

const usageProps = (usage: IUsageSpecs) => {
	return {
		completionTokens: usage.completion_tokens,
		promptTokens: usage.prompt_tokens,
		totalTokens: usage.total_tokens,
	};
};

export /*bundle*/ class AgentAPI {
	#model = process.env.OPEN_AI_MODEL;
	embedding = new EmbeddingAPI(0.2, 'es', this.#model);

	#configuration = new Configuration({ apiKey: process.env.OPEN_AI_KEY });
	#openai = new OpenAIApi(this.#configuration);

	async run(items: ChatCompletionRequestMessage[], prompt: string, filter: {}) {
		const model = this.#model;

		let messages: ChatCompletionRequestMessage[] = [{ role: 'system', content: prompt }];
		messages = messages.concat(items);
		const { data } = await this.#openai.createChatCompletion({ model, messages, functions, max_tokens: 256 });
		const {
			usage,
			choices: [{ message: response }],
		} = data;

		const { function_call } = response;
		if (!function_call?.name) {
			return { status: true, data: { usage: usageProps(usage), output: response.content } };
		}

		if (function_call?.name === 'get_knowledge_information') {
			const { text } = JSON.parse(function_call.arguments);
			const info = await this.embedding.search(text, filter);

			messages.push({
				role: 'function',
				name: function_call.name,
				content: JSON.stringify({ info }),
			});

			const { data } = await this.#openai.createChatCompletion({ model, messages });
			const {
				usage,
				choices: [{ message: response }],
			} = data;

			return { status: true, data: { usage: usageProps(usage), output: response.content } };
		}

		if (function_call?.name === 'python') {
			return { status: true, data: { usage: usageProps(usage), output: 'No tengo informacion para ayudarte' } };
		}
	}
}
