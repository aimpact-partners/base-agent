import { OpenAI } from 'langchain/llms/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { EmbeddingsManager } from './manager';

export /*bundle*/ class EmbeddingAPI {
    #model: OpenAI;
    get model() {
        return this.#model;
    }

    #embedding: OpenAIEmbeddings;
    get embedding() {
        return this.#embedding;
    }

    #manager: EmbeddingsManager;
    get manager() {
        return this.#manager;
    }

    constructor(temperature: number = 0.2, language: string = 'es', model = 'gpt-3.5-turbo') {
        const specs = { openAIApiKey: process.env.OPEN_AI_KEY };
        this.#model = new OpenAI({ ...specs, modelName: model, temperature });
        this.#embedding = new OpenAIEmbeddings(specs);
        this.#manager = new EmbeddingsManager(this);
    }

    async chain(model = undefined, metadata = {}) {
        return this.#manager.llm(model, metadata);
    }

    async query(question: string, filters?) {
        return this.#manager.query(question, filters);
    }

    async search(input: string, filters?) {
        return this.#manager.search(input, filters);
    }
}
