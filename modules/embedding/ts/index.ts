import {EmbeddingsManager} from './manager';

export /*bundle*/ class EmbeddingAPI {
	#embeddings: EmbeddingsManager;
	get embeddings() {
		return this.#embeddings;
	}

	constructor() {
		this.#embeddings = new EmbeddingsManager();
	}

	async query(question: string, filters?) {
		return this.#embeddings.query(question, filters);
	}

	async search(text: string, filters?) {
		return this.#embeddings.search(text, filters);
	}
}
