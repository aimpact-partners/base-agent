import {OpenAI} from 'langchain/llms/openai';
import {DocsManager} from './documents';
import {EmbeddingsManager} from './embeddings';

export /*bundle*/ class ChainAPI {
	#model;
	get model() {
		return this.#model;
	}

	#documents;
	get documents() {
		return this.#documents;
	}
	#embeddings;
	get embeddings() {
		return this.#embeddings;
	}

	constructor() {
		this.#model = new OpenAI({
			temperature: 0.2,
			openAIApiKey: process.env.OPEN_AI_KEY,
			modelName: 'gpt-3.5-turbo',
		});

		this.#documents = new DocsManager(this);
		this.#embeddings = new EmbeddingsManager(this);
	}

	async init(topic: string) {
		await this.#documents.prepare();
		// await this.#embeddings.init();
	}

	async update(path: string, metadata) {
		await this.#documents.prepare(path, metadata);
		await this.#embeddings.update();

		return {status: true, data: {message: 'Documents updated'}};
	}

	async query(question: string, filters?) {
		return this.#embeddings.query(question, filters);
	}

	async search(text: string, filters?) {
		return this.#embeddings.search(text, filters);
	}
}
