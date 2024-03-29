export const functions = [
	{
		name: 'get_knowledge_information',
		function: 'embedding.search',
		description: 'Consultar informacion ampliada sobre los articulos que se esta viendo en la clase',
		parameters: {
			type: 'object',
			properties: {
				text: {
					type: 'string',
					description: 'El texto a buscar en los articulos para ampliar la informacion a responder',
				},
			},
			required: ['text'],
		},
	},
];
