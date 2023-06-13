// import {Calculator} from 'langchain/tools/calculator';
import {ChainTool} from 'langchain/tools';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {EmbeddingAPI} from '@aimpact/base-agent/embedding';
import {initializeAgentExecutorWithOptions} from 'langchain/agents';

export /*bundle*/ class AgentAPI {
	#api = new EmbeddingAPI();

	async init(input: string, temperature: number = 0, language = 'es') {
		const model = new ChatOpenAI({
			openAIApiKey: process.env.OPEN_AI_KEY,
			temperature,
			language: 'es',
		});

		const chain = await this.#api.chain();

		const tools = [
			new ChainTool({
				name: 'documents embeddings',
				description: 'This tool retrieves information from stored documents,',
				chain: chain,
				returnDirect: true,
			}),
		];

		try {
			const executor = await initializeAgentExecutorWithOptions(tools, model, {
				// agentType: 'zero-shot-react-description',
				// agentType: 'chat-zero-shot-react-description',
				agentType: 'chat-conversational-react-description',
				maxIterations: 3,
			});

			const result = await executor.call({input});
			return {status: true, data: {output: result.output}};
		} catch (e) {
			console.log('en el catch del agent', e);
			return {status: false, error: e.message};
		}
	}
}
