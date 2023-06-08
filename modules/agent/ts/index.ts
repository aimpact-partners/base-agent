// import {Calculator} from 'langchain/tools/calculator';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {ChainAPI} from '@aimpact/base-agent/api';
import {initializeAgentExecutorWithOptions} from 'langchain/agents';
import {DynamicTool} from 'langchain/tools';

console.log('update Agent code');

export /*bundle*/ class AgentAPI {
	#model;
	get model() {
		return this.#model;
	}

	#api = new ChainAPI();

	async init(input: string) {
		const model = new ChatOpenAI({openAIApiKey: process.env.OPEN_AI_KEY, temperature: 0});
		// const tools = [serpApi, this.#api, new Calculator()];

		const tools = [
			new DynamicTool({
				name: 'knowledge page',
				description: 'consult all the information filtering by subject and type of documents',
				func: () => this.#api.query(input),
			}),
		];

		const executor = await initializeAgentExecutorWithOptions(tools, model, {
			agentType: 'zero-shot-react-description',
		});

		const result = await executor.call({input});
		return {status: true, data: result.output};
	}
}
