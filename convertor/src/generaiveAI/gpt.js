// src/api.js
import axios from "axios";

const API_KEY = process.env.REACT_APP_GPT_KEY;

export const getChatGPTResponse = async (message) => {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      // model: "gpt-4o-mini",
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 150,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );
  return response.data.choices[0].message.content.trim();
};
