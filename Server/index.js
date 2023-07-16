const express = require("express");
const app = express();
const { OpenAI } = require("langchain/llms/openai");
const cors = require("cors");
const {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} = require("langchain/prompts");
const { ChatOpenAI } = require("langchain/chat_models/openai");

const Port = process.env.PORT || 3000;
require("dotenv").config();
app.use(express.json());
app.use(cors());

const model = new OpenAI({
  modelName: "text-davinci-003", // Defaults to "text-davinci-003" if no model provided.
  temperature: 0.9,
  openAIApiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
});

const chat = new ChatOpenAI({ temperature: 0 });
app.post("/chatbox", async (req, res) => {
  try {
    // initiliza template
    const { text, InputLanguage, OutputLanguage } = req.body;

    const translationPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "You are a helpful assistant that translates {input_language} to {output_language}."
      ),
      HumanMessagePromptTemplate.fromTemplate("{text}"),
    ]);
    const data = await model.call(text);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Use Template
    const responseA = await chat.generatePrompt([
      await translationPrompt.formatPromptValue({
        input_language: InputLanguage,
        output_language: OutputLanguage,
        text: data,
      }),
    ]);
    res.status(200).send(responseA);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(Port, () => {
  console.log("This is Running on Port: ", Port);
});

// const response = await getJson("google", {
//   api_key: process.env.SERPAPI_API_KEY,
//   q: "coffee",
//   location: "Austin, Texas",
// });
// res.status(200).send(response);
// -------------------------------------------------------------------------
// const response = await chat.call([
//   new HumanMessage(
//     "Translate this sentence from English to French. I love programming."
//   ),
// ]);
// const data = response;
// res.status(200).send(data);
// ----------------------------------------------------------------------------------------
// const responseB = await chat.call([
//   new SystemMessage(
//     "You are a helpful assistant that translates English to French."
//   ),
//   new HumanMessage("Translate: I love programming."),
// ]);
// res.status(200).send(responseB);
// -----------------------------------------------------------------------------------
// *********************************************************************************************
// *************************************************************************************************
// -----------------------------------------------------------------------------------------------
// import { HumanMessage } from "langchain/schema";
// new HumanMessage("Hello, how are you?");
// import { AIMessage } from "langchain/schema";
// new AIMessage("I am doing well, thank you!");
// -----------------------------------------------------------------------
