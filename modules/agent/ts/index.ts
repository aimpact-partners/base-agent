import { Calculator } from 'langchain/tools/calculator';
import { ChainTool } from 'langchain/tools';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { EmbeddingAPI } from '@aimpact/base-agent/embedding';
import { ChatConversationalAgent, initializeAgentExecutorWithOptions } from 'langchain/agents';

export /*bundle*/ class AgentAPI {
    #embedding = new EmbeddingAPI();

    async init(input: string, metadata: {} | string, temperature: number = 0, language = 'es') {
        const model = new ChatOpenAI({
            openAIApiKey: process.env.OPEN_AI_KEY,
            temperature,
            language,
        });
        const chain = await this.#embedding.chain(metadata);
        const tools =
            metadata === 'default'
                ? []
                : [
                      new ChainTool({
                          name: 'documents embeddings',
                          description:
                              'This tool retrieves information from stored documents, only if metadata has been passed in the llm model filter',
                          chain: chain,
                          returnDirect: true,
                      }),
                      new Calculator(),
                  ];

        try {
            const chatAgent = ChatConversationalAgent.fromLLMAndTools(model, tools);
            const executor = await initializeAgentExecutorWithOptions(tools, model, {
                agentType: 'chat-conversational-react-description',
                agentArgs: chatAgent,
                maxIterations: 3,
            });
            const result = await executor.call({ input });
            // console.log('after executor', result.output);

            return { status: true, data: { output: result.output } };
        } catch (e) {
            console.log('en el catch del agent', e);
            return { status: false, error: e.message };
        }
    }
}
