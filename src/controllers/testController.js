const { generateJestTests } = require("../service/ollamaService");
const { writeSourceFile, writeTestFile } = require("../service/fileService");
const { runJestTests } = require("../service/jestService");

function getDeploymentDecision(passPercentage) {
  if (passPercentage === 100) return "AUTO_DEPLOY";
  if (passPercentage >= 50) return "MANUAL_REVIEW";
  return "BLOCKED";
}

async function generateTests(req, res) {
  try {
    console.log("1. Request received");

    const { functionName, functionCode, runTests = true } = req.body;

    if (!functionName || !functionCode) {
      return res.status(400).json({
        success: false,
        message: "functionName and functionCode are required"
      });
    }

    writeSourceFile(functionCode);
    console.log("2. Source file written");

    const aiResult = await generateJestTests(functionName, functionCode);
    console.log("3. Ollama response received");

    const generatedTestCode = aiResult.testFileContent;

    writeTestFile(generatedTestCode);
    console.log("4. Test file written");

    let testResult = null;
    let passPercentage = 0;
    let decision = "MANUAL_REVIEW";

    if (runTests) {
      console.log("5. Running Jest...");
      testResult = await runJestTests();
      console.log("6. Jest finished");

      if (testResult.total > 0) {
        passPercentage = Math.round((testResult.passed / testResult.total) * 100);
      }

      decision = getDeploymentDecision(passPercentage);
    }

    return res.status(200).json({
      success: true,
      message: "Tests generated successfully",
      data: {
        functionName,
        generatedTestCode,
        testResult,
        passPercentage,
        deploymentDecision: decision
      }
    });
  } catch (error) {
    console.error("Controller error:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { generateTests };