function buildPrompt(functionName, functionCode) {
  return `
You are a senior JavaScript QA engineer.

Generate only a valid Jest test file for the given CommonJS JavaScript function.

Strict rules:
- Return only raw JavaScript code
- Do not write markdown fences
- Do not write explanations
- Do not write headings
- Do not write notes
- Use CommonJS syntax
- Import from "./sample"
- Test function name: ${functionName}
- Include at least 5 meaningful test cases
- Cover normal, edge, and invalid input cases if reasonable

Function code:
${functionCode}
`.trim();
}

module.exports = { buildPrompt };