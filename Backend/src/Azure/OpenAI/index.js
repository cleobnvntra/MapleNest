const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runPrompt(user_prompt, system_prompt, max_tokens, temp = 0.5) {
  const messages = [
    {
      role: "system",
      content: system_prompt,
    },
    {
      role: "user",
      content: user_prompt,
    },
  ];

  try {
    const result = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      max_tokens,
      temperature: temp,
    });

    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error during OpenAI API call:", error);
    throw error;
  }
}

module.exports.runPrompt = runPrompt;
