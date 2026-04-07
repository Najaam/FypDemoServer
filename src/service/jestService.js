const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

function extractJsonFromText(text = "") {
  const lines = text.trim().split("\n").reverse();

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        // ignore invalid JSON line
      }
    }
  }

  return null;
}

function stripAnsi(text = "") {
  return text.replace(/\u001b\[[0-9;]*m/g, "");
}

function normalizePassFailLine(line = "") {
  const trimmed = line.trim();

  if (trimmed.startsWith("PASS")) return "PASS";
  if (trimmed.startsWith("FAIL")) return "FAIL";

  return line;
}

function cleanJestLogs(text = "") {
  const cleaned = stripAnsi(text);

  return cleaned
    .split("\n")
    .map((line) => normalizePassFailLine(line))
    .filter((line) => {
      const trimmed = line.trim();

      if (!trimmed) return false;

      if (trimmed.includes("Ran all test suites within paths")) return false;
      if (trimmed.includes("Ran all test suites matching")) return false;
      if (trimmed.includes("Test results written to:")) return false;

      if (/^\d+\s*\|/.test(trimmed)) return false;
      if (/^>\s*\d+\s*\|/.test(trimmed)) return false;
      if (/^\|/.test(trimmed)) return false;
      if (/^\^+$/.test(trimmed)) return false;

      return true;
    })
    .join("\n")
    .trim();
}

function extractUsefulError(text = "") {
  const cleaned = cleanJestLogs(text);

  const usefulLines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;

      return (
        line === "FAIL" ||
        line === "PASS" ||
        line.startsWith("TypeError:") ||
        line.startsWith("Error:") ||
        line.startsWith("Expected") ||
        line.startsWith("Received") ||
        line.includes("did not throw") ||
        line.includes("is not a function") ||
        line.includes("toThrow") ||
        line.includes("Test Suites:") ||
        line.includes("Tests:")
      );
    });

  return usefulLines.join("\n").trim();
}

function runJestTests(testFilePath) {
  const sandboxPath = path.join(process.cwd(), "sandbox");
  const outputFile = path.join(sandboxPath, "jest-result.json");
  const exactPath = testFilePath || path.join(sandboxPath, "sample.test.js");

  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }

  return new Promise((resolve) => {
    exec(
      `npx jest --runTestsByPath "${exactPath}" --runInBand --json --outputFile="${outputFile}"`,
      {
        cwd: sandboxPath,
        timeout: 30000
      },
      (error, stdout, stderr) => {
        let parsed = null;

        try {
          if (fs.existsSync(outputFile)) {
            const fileContent = fs.readFileSync(outputFile, "utf8");
            parsed = JSON.parse(fileContent);
          }
        } catch (e) {
          parsed = null;
        }

        if (!parsed) {
          parsed = extractJsonFromText(stdout) || extractJsonFromText(stderr);
        }

        const cleanedStdout = cleanJestLogs(stdout);
        const cleanedStderr = extractUsefulError(stderr) || cleanJestLogs(stderr);

        if (parsed) {
          return resolve({
            success: parsed.success ?? !error,
            passed: parsed.numPassedTests || 0,
            failed: parsed.numFailedTests || 0,
            total: parsed.numTotalTests || 0,
            rawStdout: "",
            rawStderr: cleanedStderr
          });
        }

        resolve({
          success: false,
          passed: 0,
          failed: 0,
          total: 0,
          rawStdout: "",
          rawStderr:
            cleanedStderr ||
            cleanedStdout ||
            (error ? error.message : "Jest output could not be parsed")
        });
      }
    );
  });
}

module.exports = { runJestTests };