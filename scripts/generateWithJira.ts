import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function fetchJiraIssue(issueKey: string) {
  const response = await axios.get(
    `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`,
    {
      auth: {
        username: process.env.JIRA_EMAIL!,
        password: process.env.JIRA_API_TOKEN!
      },
      headers: { Accept: "application/json" }
    }
  );

  return response.data.fields;
}

async function main() {
  const issueKey = process.argv[2];

  if (!issueKey) {
    console.log("Please provide issue key. Example: SCRUM-3");
    process.exit(1);
  }

  const issue = await fetchJiraIssue(issueKey);

  const content = `
# Jira Story

Key: ${issueKey}
Summary: ${issue.summary}

Description:
${issue.description?.content?.[0]?.content?.[0]?.text || "No description"}

Acceptance Criteria:
${issue.customfield_10000 || "Add manually if needed"}
`;

  fs.writeFileSync(`./prompts/${issueKey}.md`, content);

  console.log("Story exported successfully.");
}

main();