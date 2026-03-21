const { exec } = require("child_process");
const path = require("path");

function runJestTests() {
  const sandboxPath = path.join(process.cwd(), "sandbox");

  return new Promise((resolve) => {
    exec(
      "npx jest sample.test.js --runInBand --json",
      {
        cwd: sandboxPath,
        timeout: 30000
      },
      (error, stdout, stderr) => {
        let parsed = null;

        try {
          parsed = JSON.parse(stdout);
        } catch (e) {
          parsed = null;
        }

        if (parsed) {
          return resolve({
            success: parsed.success ?? !error,
            passed: parsed.numPassedTests || 0,
            failed: parsed.numFailedTests || 0,
            total: parsed.numTotalTests || 0,
            rawStdout: stdout,
            rawStderr: stderr
          });
        }

        resolve({
          success: false,
          passed: 0,
          failed: 0,
          total: 0,
          rawStdout: stdout,
          rawStderr: stderr || (error ? error.message : "Jest output could not be parsed")
        });
      }
    );
  });
}

module.exports = { runJestTests };