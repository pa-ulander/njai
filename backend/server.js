import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from 'openai';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("Please set you openai api key into OPENAI_API_KEY in the .env file");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const question = req.body.question;

    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      prompt: `${question}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });
    // console.log('reponse: ', response);
    res.status(200).send({
      bot: response.choices[0].text,
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status);  // e.g. 401
      console.error(error.message); // e.g. The authentication token you passed was invalid...
      console.error(error.code);  // e.g. 'invalid_api_key'
      console.error(error.type);  // e.g. 'invalid_request_error'
    } else {
      // Non-API error
      console.log(error);
    }
  }
});

app.listen(8000, () => {
  console.log("App is running");
});
