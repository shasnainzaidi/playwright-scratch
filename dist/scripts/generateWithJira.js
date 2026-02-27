"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
async function fetchJiraIssue(issueKey) {
    const response = await axios_1.default.get(`${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`, {
        auth: {
            username: process.env.JIRA_EMAIL,
            password: process.env.JIRA_API_TOKEN
        },
        headers: { Accept: "application/json" }
    });
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
    fs_1.default.writeFileSync(`./prompts/${issueKey}.md`, content);
    console.log("Story exported successfully.");
}
main();
//# sourceMappingURL=generateWithJira.js.map