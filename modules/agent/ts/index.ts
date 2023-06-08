// import {Calculator} from 'langchain/tools/calculator';
import {DynamicTool} from 'langchain/tools';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {EmbeddingAPI} from '@aimpact/base-agent/embedding';
import {initializeAgentExecutorWithOptions} from 'langchain/agents';

export /*bundle*/ class AgentAPI {
	#api = new EmbeddingAPI();

	async init(input: string, temperature: number = 0) {
		// TODO temperature
		const model = new ChatOpenAI({openAIApiKey: process.env.OPEN_AI_KEY, temperature});
		// const tools = [serpApi, this.#api, new Calculator()];

		const tools = [
			new DynamicTool({
				name: 'embeddings',
				description: 'consult the information filtering by subject and type of documents',
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
