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

    const sourceFilePath = writeSourceFile(functionCode);
    console.log("2. Source file written:", sourceFilePath);

    const aiResult = await generateJestTests(functionName, functionCode);
    console.log("3. Ollama response received");

    if (!aiResult || !aiResult.testFileContent) {
      return res.status(500).json({
        success: false,
        message: "AI did not return valid test content"
      });
    }

    const generatedTestCode = aiResult.testFileContent;
    const testFilePath = writeTestFile(generatedTestCode);
    console.log("4. Test file written:", testFilePath);

    let testResult = null;
    let passPercentage = 0;
    let decision = "NOT_RUN";

    if (runTests) {
      console.log("5. Running Jest on:", testFilePath);
      testResult = await runJestTests(testFilePath);
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
        sourceFilePath,
        testFilePath,
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