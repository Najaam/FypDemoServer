const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000
});

async function generateJestTests(functionName, functionCode) {
  console.log("OpenAI service called");

  const prompt = `
Generate only Jest test code for this CommonJS JavaScript function.

Rules:
- Return only raw JavaScript code
- No markdown
- Use require("./sample")
- Function name is ${functionName}

Code:
${functionCode}
`;

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
    input: prompt
  });

  console.log("OpenAI raw response received");

  return {
    testFileContent: response.output_text
  };
}

module.exports = { generateJestTests };