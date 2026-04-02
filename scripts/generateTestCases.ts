import fs from "fs";
import path from "path";

async function main() {
  const issueKey = process.argv[2];

  if (!issueKey) {
    console.log("Provide Jira key");
    process.exit(1);
  }

  const storyPath = path.join("prompts", `${issueKey}.md`);
  const promptPath = path.join("prompts", "test-generation-prompt.md");

  const story = fs.readFileSync(storyPath, "utf-8");
  const prompt = fs.readFileSync(promptPath, "utf-8");

  const finalPrompt = `${prompt}\n\n${story}`;
const outputPath = `prompts/${issueKey}-ai-input.md`;

fs.writeFileSync(outputPath, finalPrompt);

console.log(`✅ AI prompt saved → ${outputPath}`);
console.log("👉 Open this file in VS Code and use Copilot Chat");
 

  console.log("\n=== EXPECTED OUTPUT === JSON ===");
}

main();