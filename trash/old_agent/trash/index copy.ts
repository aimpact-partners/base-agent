// // import {Calculator} from 'langchain/tools/calculator';
// import {DynamicTool} from 'langchain/tools';
// import {ChatOpenAI} from 'langchain/chat_models/openai';
// import {OpenAI} from 'langchain/llms/openai';
// import {OpenAITool} from 'langchain/tools';
// import {createFallbackAgent} from 'langchain/agents';
// import {EmbeddingAPI} from '@aimpact/base-agent/embedding';
// import {initializeAgentExecutorWithOptions} from 'langchain/agents';

// export /*bundle*/ class AgentAPI {
// 	#api = new EmbeddingAPI();

// 	async init(input: string, temperature: number = 0) {
// 		// TODO temperature
// 		const model = new ChatOpenAI({openAIApiKey: process.env.OPEN_AI_KEY, temperature});
// 		// const tools = [serpApi, this.#api, new Calculator()];

// 		try {
// 			//-

// 			const model = new OpenAI({});
// 			const tools = [
// 				new DynamicTool({
// 					name: 'documents embeddings',
// 					description:
// 						'This tool retrieves information from stored documents,' +
// 						'if you do not have the answer you can consult the OpenAi API',
// 					func: () => this.#api.query(input),
// 				}),
// 			];

// 			const fallbackTool = new OpenAITool({llm: model});
// 			const agent = createFallbackAgent(model, tools, fallbackTool);
// 			//-

// 			const executor = await initializeAgentExecutorWithOptions(tools, model, {
// 				agentType: 'zero-shot-react-description',
// 			});

// 			const result = await executor.call({input});
// 			return {status: true, data: {output: result.output}};
// 		} catch (e) {
// 			console.log('en el catch del agent', e);
// 			return {status: false, error: e.message};
// 		}
// 	}
// }
