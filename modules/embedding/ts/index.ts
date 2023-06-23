import { EmbeddingsManager } from './manager';

export /*bundle*/ class EmbeddingAPI {
    #embeddings: EmbeddingsManager;
    get embeddings() {
        return this.#embeddings;
    }

    constructor(temperature: number = 0.2, language: string = 'es') {
        this.#embeddings = new EmbeddingsManager(temperature, language);
    }

    async chain(model = undefined, metadata = {}) {
        return this.#embeddings.llm(model, metadata);
    }

    async query(question: string, filters?) {
        return this.#embeddings.query(question, filters);
    }

    async search(text: string, filters?) {
        return this.#embeddings.search(text, filters);
    }
}
