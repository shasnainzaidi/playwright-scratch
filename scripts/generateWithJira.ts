import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

/**
 * Extract formatted text from Jira ADF (preserves structure)
 */
function extractFormattedText(node: any): string {
  if (!node) return '';

  if (node.type === 'text') {
    return node.text;
  }

  if (node.type === 'hardBreak') {
    return '\n';
  }

  if (node.type === 'paragraph') {
    return node.content?.map(extractFormattedText).join('') + '\n\n';
  }

  if (node.type === 'heading') {
    return '\n\n' + node.content?.map(extractFormattedText).join('') + '\n';
  }

  if (node.type === 'listItem') {
    return '- ' + node.content?.map(extractFormattedText).join('').trim() + '\n';
  }

  if (node.type === 'bulletList' || node.type === 'orderedList') {
    return node.content?.map(extractFormattedText).join('') + '\n';
  }

  if (node.content) {
    return node.content.map(extractFormattedText).join('');
  }

  return '';
}

/**
 * Split sections intelligently from extracted text
 */
function splitSections(text: string) {
  const sections = {
    description: '',
    acceptance: '',
    notes: ''
  };

  const lower = text.toLowerCase();

  const accIndex = lower.indexOf('acceptance criteria');
  const notesIndex = lower.indexOf('notes');

  if (accIndex !== -1) {
    sections.description = text.substring(0, accIndex).trim();

    if (notesIndex !== -1) {
      sections.acceptance = text.substring(accIndex, notesIndex).trim();
      sections.notes = text.substring(notesIndex).trim();
    } else {
      sections.acceptance = text.substring(accIndex).trim();
    }
  } else {
    sections.description = text.trim();
  }

  return sections;
}

/**
 * Fetch Jira Issue
 */
async function fetchJiraIssue(issueKey: string) {
  const response = await axios.get(
    `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`,
    {
      auth: {
        username: process.env.JIRA_EMAIL!,
        password: process.env.JIRA_API_TOKEN!
      },
      headers: {
        Accept: "application/json"
      }
    }
  );

  return response.data.fields;
}

/**
 * Main Execution
 */
async function main() {
  const issueKey = process.argv[2];

  if (!issueKey) {
    console.log("❌ Please provide issue key. Example: SCRUM-3");
    process.exit(1);
  }

  try {
    const issue = await fetchJiraIssue(issueKey);

    const fullText = extractFormattedText(issue.description);
    const sections = splitSections(fullText);

    const content = `
# Jira Story

## Key
${issueKey}

## Summary
${issue.summary || "N/A"}

## Description
${sections.description || "No description provided"}

## Acceptance Criteria
${sections.acceptance || "No acceptance criteria provided"}

## Notes
${sections.notes || "No notes provided"}

---
Generated automatically from Jira
`;

    // Ensure prompts folder exists
    const outputDir = path.join(process.cwd(), "prompts");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const filePath = path.join(outputDir, `${issueKey}.md`);

    fs.writeFileSync(filePath, content);

    console.log(`✅ Story exported successfully → ${filePath}`);
  } catch (error: any) {
    console.error("❌ Error fetching Jira issue:");
    console.error(error.response?.data || error.message);
  }
}

main();