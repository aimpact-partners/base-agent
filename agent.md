# How to use

```ts
var {AgentAPI} = await bimport('@aimpact/base-agent/agent');
var model = new AgentAPI();
var query = 'desde cuando se hicieron publicas las apis de openai?';
var response = await model.init(query);
response;
```
