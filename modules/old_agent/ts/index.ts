import { Calculator } from 'langchain/tools/calculator';
import { ChainTool } from 'langchain/tools';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { EmbeddingAPI } from '@aimpact/base-agent/embedding';
import { LLMChain } from 'langchain/chains';
import { ZeroShotAgent, AgentExecutor } from 'langchain/agents';
import { SerpAPI } from 'langchain/tools';
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from 'langchain/prompts';
import { ChatConversationalAgent, initializeAgentExecutorWithOptions } from 'langchain/agents';

export /*bundle*/ class AgentAPI {
    #embedding = new EmbeddingAPI();

    async init(input: [], metadata: {} | string, temperature: number = 0.2, language = 'es') {
        const model = new ChatOpenAI({
            openAIApiKey: process.env.OPEN_AI_KEY,
            temperature,
            modelName: 'gpt-3.5-turbo',
        });

        let tools = [];
        if (typeof metadata === 'object') {
            const chain = await this.#embedding.chain(model, metadata);
            tools = [
                new ChainTool({
                    name: 'documentos',
                    description:
                        'Esta herramienta recupera información de documentos almacenados filtrandolos por metadata cuando se consultan en el vector, genera todas las respuesta en castellano, incluso si no tienes la respuesta',
                    chain: chain,
                    returnDirect: true,
                }),
                new Calculator(),
            ];
        }

        console.log('tools', tools);
        const prompt = ZeroShotAgent.createPrompt(tools, {
            // prefix: `Answer the following questions as best you can, but speaking as a pirate might speak. You have access to the following tools:`,
            // suffix: `Begin! Remember to speak as a pirate when giving your final answer. Use lots of "Args"`,
            prefix: ` toma el rol de un psicologo con muchos años de experiencia `,
            suffix: `tu respuesta va a dirigida a un paciente llamado Felix de 32 años, al final de tu respuesta dile "Vamo que si" `,
        });
        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            new SystemMessagePromptTemplate(prompt),
            HumanMessagePromptTemplate.fromTemplate(`{input}
		
		This was your previous work (but I haven't seen any of it! I only see what you return as final answer):
		{agent_scratchpad}`),
        ]);

        const llmChain = new LLMChain({
            prompt: chatPrompt,
            llm: model,
        });

        const agent = new ZeroShotAgent({
            llmChain,
            allowedTools: tools.map(tool => tool.name),
        });

        const executor = AgentExecutor.fromAgentAndTools({ agent, tools, maxIterations: 10 });

        try {
            console.log('input: ', input);
            const response = await executor.run(input);

            console.log('Response: ', response);

            // return { status: true, data: { output: result.output } };
        } catch (e) {
            console.error('agent catch', e);
            return { status: false, error: e.message };
        }
    }
}
