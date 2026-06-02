import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { JiraStory } from "./types.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractFormattedText(node: any): string {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  if (node.type === "paragraph")
    return (node.content?.map(extractFormattedText).join("") ?? "") + "\n\n";
  if (node.type === "heading")
    return "\n\n" + (node.content?.map(extractFormattedText).join("") ?? "") + "\n";
  if (node.type === "listItem")
    return "- " + (node.content?.map(extractFormattedText).join("").trim() ?? "") + "\n";
  if (node.type === "bulletList" || node.type === "orderedList")
    return (node.content?.map(extractFormattedText).join("") ?? "") + "\n";
  if (node.content) return node.content.map(extractFormattedText).join("");
  return "";
}

function splitSections(text: string) {
  const sections = { description: "", acceptance: "", notes: "" };
  const lower = text.toLowerCase();
  const accIndex = lower.indexOf("acceptance criteria");
  const notesIndex = lower.indexOf("notes");

  if (accIndex !== -1) {
    sections.description = text.substring(0, accIndex).trim();
    if (notesIndex !== -1 && notesIndex > accIndex) {
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

export async function fetchJiraIssue(issueKey: string): Promise<JiraStory> {
  if (!process.env.JIRA_BASE_URL || !process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
    throw new Error("Missing JIRA_BASE_URL, JIRA_EMAIL, or JIRA_API_TOKEN in .env");
  }

  console.log(`🔍 Fetching ${issueKey} from Jira...`);

  const response = await axios.get(
    `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`,
    {
      auth: {
        username: process.env.JIRA_EMAIL!,
        password: process.env.JIRA_API_TOKEN!,
      },
      headers: { Accept: "application/json" },
      timeout: 15000,
    }
  );

  const fields = response.data.fields;
  const fullText = extractFormattedText(fields.description);
  const sections = splitSections(fullText);

  return {
    key: issueKey,
    summary: fields.summary ?? "N/A",
    description: sections.description || "No description provided",
    acceptanceCriteria: sections.acceptance || "No acceptance criteria provided",
    notes: sections.notes || "No notes provided",
  };
}

export function saveStoryMarkdown(story: JiraStory): string {
  const outputDir = path.join(process.cwd(), "prompts");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const content = `# Jira Story

## Key
${story.key}

## Summary
${story.summary}

## Description
${story.description}

## Acceptance Criteria
${story.acceptanceCriteria}

## Notes
${story.notes}

---
Generated automatically from Jira
`;

  const filePath = path.join(outputDir, `${story.key}.md`);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}


const isMain = process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  const issueKey = process.argv[2];
  if (!issueKey) {
    console.error("❌ Usage: npx tsx scripts/generateWithJira.ts SCRUM-5");
    process.exit(1);
  }
  try {
    const story = await fetchJiraIssue(issueKey);
    const filePath = saveStoryMarkdown(story);
    console.log(`✅ Story exported successfully → ${filePath}`);
  } catch (error: any) {
    console.error("❌ Error fetching Jira issue:");
    console.error(error.response?.data || error.message);
    process.exit(1);
  }
}
