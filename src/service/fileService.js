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

function writeSourceFile(functionCode) {
  ensureSandboxExists();
  fs.writeFileSync(sourceFilePath, functionCode, "utf8");
}

function writeTestFile(testCode) {
  ensureSandboxExists();
  fs.writeFileSync(testFilePath, testCode, "utf8");
}

module.exports = {
  sandboxDir,
  sourceFilePath,
  testFilePath,
  writeSourceFile,
  writeTestFile
};