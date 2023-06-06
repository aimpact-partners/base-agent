import { ChatOpenAI } from "langchain/chat_models/openai";
import { Calculator } from "langchain/tools/calculator";
import { ChainAPI } from "@aimpact/base-agent/api";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "langchain/tools";

console.log("update Agent code");

export /*bundle*/ class AgentAPI {
  #model;
  get model() {
    return this.#model;
  }

  #api = new ChainAPI();

  async init(input: string) {
    const model = new ChatOpenAI({ openAIApiKey: process.env.OPEN_AI_KEY, temperature: 0 });
    // const tools = [serpApi, this.#api, new Calculator()];
    const tools = [
      new DynamicTool({
        name: "knowledge page",
        description: "consult all the information filtering by subject and type of documents",
        func: () => this.#api.query(input),
      }),
      //   new DynamicTool({
      //     name: "BAR",
      //     description: "call this to get the value of bar. input should be an empty string.",
      //     func: () => "baz1",
      //   }),
    ];

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "zero-shot-react-description",
    });
    console.log("Loaded agent.");

    // input = input ?? `What is the value of foo?`;
    // console.log(`Executing with input "${input}"...`);
    const result = await executor.call({ input });
    // console.log(`Got output ${result.output}`);
    // console.log(`Got intermediate steps ${JSON.stringify(result.intermediateSteps, null, 2)}`);

    return { status: true, data: result.output };
  }
}
