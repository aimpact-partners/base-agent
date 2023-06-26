module.exports = [
  {
    name: "get_specific_information",
    description:
      "Obtener información específica sobre la clase que Henry debe aprender sobre San Martín.",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description:
            "El texto que se debe buscar para identificar qué se está esperando que Henry aprenda específicamente",
        },
      },
      required: ["text"],
    },
  },
];
