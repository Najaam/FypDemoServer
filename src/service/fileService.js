const fs = require("fs");
const path = require("path");

const sandboxDir = path.join(process.cwd(), "sandbox");
const sourceFilePath = path.join(sandboxDir, "sample.js");
const testFilePath = path.join(sandboxDir, "sample.test.js");

function ensureSandboxExists() {
  if (!fs.existsSync(sandboxDir)) {
    fs.mkdirSync(sandboxDir, { recursive: true });
  }
}

function stripCodeFence(code = "") {
  return code
    .replace(/^```[a-zA-Z]*\s*/, "")
    .replace(/\s*```$/, "")
    .trim();
}

function writeSourceFile(functionCode) {
  ensureSandboxExists();
  fs.writeFileSync(sourceFilePath, functionCode, "utf8");
  return sourceFilePath;
}

function writeTestFile(testCode) {
  ensureSandboxExists();
  const cleanCode = stripCodeFence(testCode);
  fs.writeFileSync(testFilePath, cleanCode, "utf8");
  return testFilePath;
}

module.exports = {
  sandboxDir,
  sourceFilePath,
  testFilePath,
  writeSourceFile,
  writeTestFile
};