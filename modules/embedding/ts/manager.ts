import { VectorDBQAChain } from 'langchain/chains';
import { PineconeClient } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import * as dotenv from 'dotenv';
dotenv.config();

interface ISpecs {
	pineconeIndex: any;
	filter?: {};
}

export /*bundle*/ class EmbeddingsManager {
	#parent;
	#client: PineconeClient;
	#vectorStore: PineconeStore;
	#map = new Map();

	constructor(parent) {
		this.#parent = parent;
		this.#client = new PineconeClient();
	}

	async setVector(metadata: {} = undefined) {
		await this.#client.init({
			apiKey: process.env.PINECONE_API_KEY,
			environment: process.env.PINECONE_ENVIRONMENT,
		});

		// const indexes = await this.#client.listIndexes();
		// if (!indexes.length && !indexes.includes(process.env.PINECONE_INDEX_NAME)) {
		// 	return {status: false, error: `Embedding index "${process.env.PINECONE_INDEX_NAME}" not found`};
		// }

		const pineconeIndex = this.#client.Index(process.env.PINECONE_INDEX_NAME);

		const specs: ISpecs = { pineconeIndex };
		metadata && (specs.filter = metadata);
		this.#vectorStore = await PineconeStore.fromExistingIndex(this.#parent.embedding, specs);

		this.#map.set(pineconeIndex, this.#vectorStore);
	}

	async search(input: string, filters) {
		if (!this.#vectorStore) await this.setVector();

		const results = await this.#vectorStore.similaritySearch(input, 1, filters);
		return { status: true, data: results[0]?.pageContent };
	}

	async query(question: string, filter = undefined) {
		if (!this.#vectorStore) await this.setVector(filter);

		const chain = VectorDBQAChain.fromLLM(this.#parent.model, this.#vectorStore, {
			k: 1,
			returnSourceDocuments: false,
		});

		const response = await chain.call({ query: question });
		return { status: true, data: response.text };
	}

	async llm(model = undefined, filter = undefined) {
		if (!this.#vectorStore) await this.setVector(filter);

		model = model ?? this.#parent.model;
		return VectorDBQAChain.fromLLM(model, this.#vectorStore, {
			k: 1,
			returnSourceDocuments: false,
		});
	}
}
