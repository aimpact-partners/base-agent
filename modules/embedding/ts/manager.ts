import { OpenAI } from 'langchain/llms/openai';
import { VectorDBQAChain } from 'langchain/chains';
import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import * as dotenv from 'dotenv';
dotenv.config();

export /*bundle*/ class EmbeddingsManager {
    #model: OpenAI;
    #embedding: OpenAIEmbeddings;
    #vectorStore: PineconeStore;
    #client: PineconeClient;
    #map = new Map();

    constructor() {
        this.#client = new PineconeClient();
        this.#model = new OpenAI({
            openAIApiKey: process.env.OPEN_AI_KEY,
            modelName: 'gpt-3.5-turbo',
            temperature: 0.2,
        });
        this.#embedding = new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_AI_KEY });
    }

    async setVector() {
        await this.#client.init({
            apiKey: process.env.PINECONE_API_KEY,
            environment: process.env.PINECONE_ENVIRONMENT,
        });

        // const indexes = await this.#client.listIndexes();
        // if (!indexes.length && !indexes.includes(process.env.PINECONE_INDEX_NAME)) {
        // 	return {status: false, error: `Embedding index "${process.env.PINECONE_INDEX_NAME}" not found`};
        // }

        const pineconeIndex = this.#client.Index(process.env.PINECONE_INDEX_NAME);
        this.#vectorStore = await PineconeStore.fromExistingIndex(this.#embedding, { pineconeIndex });
        this.#map.set(pineconeIndex, this.#vectorStore);
    }

    async search(question: string, filters) {
        if (!this.#vectorStore) await this.setVector();

        console.log('search filters', filters);
        const results = await this.#vectorStore.similaritySearch(question, 1, filters);
        return { status: true, data: results };
    }

    async query(question: string, filters) {
        if (!this.#vectorStore) await this.setVector();

        const chain = VectorDBQAChain.fromLLM(this.#model, this.#vectorStore, {
            k: 1,
            returnSourceDocuments: false,
        });

        const response = await chain.call({ query: question });
        return { status: true, data: response.text };
    }

    async llm(metadata: {}) {
        if (!this.#vectorStore) await this.setVector();

        console.log('agent embedding llm', {
            k: 1,
            returnSourceDocuments: false,
            filter: { metadata: metadata },
        });

        return VectorDBQAChain.fromLLM(this.#model, this.#vectorStore, {
            k: 1,
            returnSourceDocuments: false,
            filter: { metadata: metadata },
        });
    }
}
