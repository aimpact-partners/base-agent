import type { IAgentRequestParams, AgentResponseType } from '@aimpact/agents-client/agent';
import { Agent } from '@aimpact/agents-client/agent';

export /*bundle*/ interface IChatMetadata {
	prompt: string;
}

export /*bundle*/ class BaseAgent extends Agent {
	async *sendMessage(params: IAgentRequestParams): AgentResponseType {
		const { user, project } = params;
		const { prompt } = <IChatMetadata>params.metadata;

		const model = 'gpt-4-1106-preview';
		const system = { prompt: { category: 'agents', name: `${project}.${prompt}` } };
		const temperature = 1;
		const literals = { user: user.name };

		// Process the agent's answer
		const iterator = super.processMessage(
			Object.assign(params, { system, model, temperature, literals, responseFormat: 'json' })
		);

		const metadata: { synthesis: string; answer: string } = { synthesis: '', answer: 'la respuesta no llega' };
		for await (const part of iterator) {
			if (part.chunk) {
				yield part;
			} else if (part.metadata) {
				metadata.answer = part.metadata.answer;
				metadata.synthesis = part.metadata.synthesis;

				// The "ÿ" character is used as a separator
				// It separates the chunks of the main response, with some other information
				// that Chat API requires (actually the updated synthesis of the conversation)
				yield { chunk: 'ÿ' };
				yield { chunk: JSON.stringify(metadata) };
			}
		}
	}
}
