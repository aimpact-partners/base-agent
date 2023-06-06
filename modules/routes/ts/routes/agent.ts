import { AgentAPI } from "@aimpact/base-agent/agent";

export class Agent {
  #app;
  #agent;

  constructor(app) {
    this.#app = app;
    this.#agent = new AgentAPI();
    this.#app.post("/agent", this.execute.bind(this));
  }

  async execute(req, res) {
    const { query } = req.body;
    if (!query) {
      return res.status(400).send({ status: false, error: "No data to process" });
    }

    try {
      const response = await this.#agent.init(query);
      console.log("response", response);
      if (!response.status) {
        res.json({
          status: false,
          error: `Error processing: ${response.error}`,
        });
        return;
      }
      return res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing request");
    }
  }
}
