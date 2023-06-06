import { Agent } from "./routes/agent";

export /*bundle*/
function routes(app) {
  app.get("/", (req, res) => res.send("@aimpact/base-agent http server"));
  new Agent(app);
}
