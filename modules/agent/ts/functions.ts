export const functions = [
    {
        name: 'get_knowledge_information',
        function: 'embedding.search',
        description: 'Consultar informacion sobre las preguntas del usuario.',
        parameters: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    description:
                        'El texto que se debe buscar para identificar qué se está esperando que el alumno aprenda específicamente',
                },
            },
            required: ['text'],
        },
    },
];
