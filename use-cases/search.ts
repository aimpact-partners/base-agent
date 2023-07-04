var { EmbeddingAPI } = await bimport('@aimpact/base-agent/embedding');
var model = new EmbeddingAPI(0.2, 'es', 'gpt-4-0613');
await model.search('hay algunas lecciones a bote pronto de este resultado', { container: 'elecciones-brasil' });
