const dotenv = require("dotenv");
const functions = require("./functions");
const { Configuration, OpenAIApi } = require("openai");
const kb = require("./kb");

dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

exports.sendMessage = async function (system, message) {
  const openai = new OpenAIApi(configuration);

  const model = "gpt-3.5-turbo-0613";

  const messages = [
    { role: "system", content: system },
    { role: "user", content: message },
  ];

  const { data } = await openai.createChatCompletion({
    model,
    messages,
    functions,
  });

  const {
    usage,
    choices: [{ message: response }],
  } = data;

  messages.push(response);

  console.log("USAGE:", usage);
  console.log("RESPONSE:", response);

  const { function_call } = response;
  if (function_call?.name === "get_specific_information") {
    const { text } = JSON.parse(function_call.arguments);
    const info = await kb(text);

    messages.push({
      role: "function",
      name: function_call.name,
      content: JSON.stringify({ info }),
    });

    const { data } = await openai.createChatCompletion({ model, messages });
    const {
      usage,
      choices: [{ message: response }],
    } = data;

    console.log("USAGE:", usage);
    console.log("RESPONSE:", response);
  }
};
