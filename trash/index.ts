import {OpenAI} from 'langchain/llms/openai';
import {initializeAgentExecutorWithOptions} from 'langchain/agents';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {serpApi} from './tools/serp';
import {Calculator} from 'langchain/tools/calculator';
import {EmbeddingAPI} from '@aimpact/base-agent/embedding';
import {DynamicStructuredTool} from 'langchain/tools';

console.log('update Agent code');

export /*bundle*/ class AgentAPI {
	#model;
	get model() {
		return this.#model;
	}

	#api = new EmbeddingAPI();

	async init(input: string) {
		const model = new ChatOpenAI({openAIApiKey: process.env.OPEN_AI_KEY, temperature: 0});
		// const tools = [serpApi, this.#api, new Calculator()];
		const tools = [
			new DynamicStructuredTool({
				name: '',
				description: '',
			}),
			new Calculator(),
		];

		const executor = await initializeAgentExecutorWithOptions(tools, model, {
			agentType: 'chat-zero-shot-react-description',
		});
		console.log('Loaded agent.');

		input = input ?? `Who is Olivia Wilde's boyfriend?`;

		console.log(`Executing with input "${input}"...`);

		const result = await executor.call({input});

		console.log(`Got output ${result.output}`);

		console.log(`Got intermediate steps ${JSON.stringify(result.intermediateSteps, null, 2)}`);

		return {status: true, data: result.output};
	}
}
