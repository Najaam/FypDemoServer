const axios = require("axios");
const { buildPrompt } = require("../utils/promptBuilder");

async function generateJestTests(functionName, functionCode) {
  const prompt = buildPrompt(functionName, functionCode);

  const response = await axios.post(
    process.env.OLLAMA_URL || "http://localhost:11434/api/generate",
    {
      model: process.env.OLLAMA_MODEL || "llama3",
      prompt,
      stream: false
    },
    {
      timeout: 120000
    }
  );

  const output = response.data?.response;

  if (!output) {
    throw new Error("No response returned from Ollama.");
  }

  return {
    testFileContent: output.trim()
  };
}

module.exports = { generateJestTests };