import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { EmbeddingAPI } from '@aimpact/base-agent/embedding';
import { functions } from './functions';

export /*bundle*/ class AgentAPI {
    #model = 'gpt-3.5-turbo-0613';
    embedding = new EmbeddingAPI(0.2, 'es', this.#model);

    #configuration = new Configuration({ apiKey: process.env.OPEN_AI_KEY });
    #openai = new OpenAIApi(this.#configuration);

    async run(items: ChatCompletionRequestMessage[], prompt: string, filter: {}) {
        const model = this.#model;
        const messages: ChatCompletionRequestMessage[] = [{ role: 'system', content: prompt }];
        messages.concat(items);

        // if (filter) {
        //     messages[messages.length - 1].text += 'filterby';
        // }

        const { data } = await this.#openai.createChatCompletion({ model, messages, functions });

        const {
            usage,
            choices: [{ message: response }],
        } = data;

        // console.log('USAGE :', usage);
        // console.log('RESPONSE :', response);

        const { function_call } = response;
        console.log('function_call?.name ', function_call?.name);
        console.log('==filter==', filter);

        if (!function_call?.name) {
            return { status: true, data: { usage, output: response.content } };
        }

        if (function_call?.name === 'get_knowledge_information') {
            const { text } = JSON.parse(function_call.arguments);
            const info = await this.embedding.search(text, filter);

            messages.push({
                role: 'function',
                name: function_call.name,
                content: JSON.stringify({ info }),
            });

            const { data } = await this.#openai.createChatCompletion({ model, messages });
            const {
                usage,
                choices: [{ message: response }],
            } = data;

            // console.log('USAGE on function:', usage);
            // console.log('RESPONSE on function:', response, response.content);

            return { status: true, data: { usage, output: response.content } };
        }

        if (function_call?.name === 'python') {
            return { status: true, data: { usage, output: 'No tengo informacion para ayudarte' } };
        }
    }
}
