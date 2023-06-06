import { AgentAPI } from "@aimpact/base-agent/agent";

export class Agent {
  #app;
  #agent;

  constructor(app) {
    this.#app = app;
    this.#agent = new AgentAPI();

    this.#app.post("/agent", this.execute);
  }

  async execute(req, res) {
    console.log("in execute", req.body.query);
    console.log("in execute res ", res);
    await this.#agent.init(req.body.query);
    res.json({ status: true, data: { response: "endpoint" } });
  }
}
