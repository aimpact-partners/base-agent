import { Calculator } from 'langchain/tools/calculator';
import { ChainTool } from 'langchain/tools';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { EmbeddingAPI } from '@aimpact/base-agent/embedding';
import { ChatConversationalAgent, initializeAgentExecutorWithOptions } from 'langchain/agents';
import { OpenAI } from 'langchain/llms/openai';
import { VectorDBQAChain } from 'langchain/chains';
import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX_NAME);
    const vectorStore = await PineconeStore.fromExistingIndex(embedding, { pineconeIndex });

    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
        k: 1,
        returnSourceDocuments: false,
    });

    const tools = [
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
        const result = await executor.call({ input: 'Ques es la IA?' });

        return { status: true, data: { output: result.output } };
    } catch (e) {
        console.error(e);
    }
}
