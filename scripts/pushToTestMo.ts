import axios from "axios";
import type { AxiosError } from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import type { TestCase } from "./types.js"; // .js extension required by NodeNext

dotenv.config();

const BASE_URL = process.env.TESTMO_BASE_URL!;
const TOKEN = process.env.TESTMO_API_TOKEN!;
const PROJECT_ID = Number(process.env.TESTMO_PROJECT_ID ?? "1");
const GROUP_ID = Number(process.env.TESTMO_GROUP_ID ?? "1");
const REPOSITORY_ID = Number(process.env.TESTMO_REPOSITORY_ID ?? "1");

const PRIORITY_MAP: Record<string, number> = {
  high: 2,
  medium: 3,
  low: 4,
};

function formatForTestmo(tc: TestCase) {
  return {
    name: String(tc.title),
    repository_id: REPOSITORY_ID,
    group_id: GROUP_ID,
    priority: PRIORITY_MAP[tc.priority] ?? 3,
    steps: tc.steps?.map((s) => ({
      content: String(s.step || "Step not defined"),
      expected: String(s.expected || "Expected result"),
    })) ?? [{ content: "Step not defined", expected: "Expected result" }],
  };
}

async function uploadWithRetry(
  formattedCases: ReturnType<typeof formatForTestmo>[],
  attempt = 1
): Promise<void> {
  const maxAttempts = 3;
  try {
    await axios.post(
      `${BASE_URL}/api/v1/projects/${PROJECT_ID}/cases`,
      { cases: formattedCases },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );
  } catch (err) {
    const status = (err as AxiosError).response?.status;
    if (attempt < maxAttempts && (status === 429 || status === 503 || status === 502)) {
      const waitMs = attempt * 2000;
      console.warn(`⚠️  Testmo returned ${status}. Retrying in ${waitMs / 1000}s...`);
      await new Promise((r) => setTimeout(r, waitMs));
      return uploadWithRetry(formattedCases, attempt + 1);
    }
    const detail = (err as AxiosError).response?.data as any;
    throw new Error(`Testmo API error ${status}: ${detail?.message ?? (err as Error).message}`);
  }
}

export async function pushManualCases(testCases: TestCase[]): Promise<void> {
  if (!BASE_URL || !TOKEN) {
    throw new Error("Missing TESTMO_BASE_URL or TESTMO_API_TOKEN in .env");
  }

  const manual = testCases.filter((tc) => tc.type === "manual");

  if (manual.length === 0) {
    console.log("ℹ️  No manual test cases to push.");
    return;
  }

  console.log(`📤 Pushing ${manual.length} manual test case(s) to Testmo...`);

  const BATCH_SIZE = 20;
  for (let i = 0; i < manual.length; i += BATCH_SIZE) {
    const chunk = manual.slice(i, i + BATCH_SIZE);
    await uploadWithRetry(chunk.map(formatForTestmo));
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(manual.length / BATCH_SIZE);
    console.log(`   ✅ Batch ${batchNum}/${totalBatches} (${chunk.length} cases)`);
  }

  console.log(`✅ Successfully pushed ${manual.length} manual test case(s) to Testmo`);
}

// ── CLI entry ─────────────────────────────────────────────────────────────────
const filePath = process.argv[2];

if (!filePath) {
  console.error("❌ Usage: npx tsx scripts/pushToTestmo.ts testcases\\SCRUM-5-manual.json");
  process.exit(1);
}

const resolvedPath = path.resolve(filePath);

if (!fs.existsSync(resolvedPath)) {
  console.error(`❌ File not found: ${resolvedPath}`);
  process.exit(1);
}

let raw: string;
try {
  raw = fs.readFileSync(resolvedPath, "utf-8");
} catch {
  console.error(`❌ Cannot read file: ${resolvedPath}`);
  process.exit(1);
}

let testCases: TestCase[];
try {
  const parsed = JSON.parse(raw);
  testCases = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.testCases)
    ? parsed.testCases
    : [];
} catch {
  console.error("❌ Invalid JSON in file.");
  process.exit(1);
}

if (testCases.length === 0) {
  console.error("❌ No test cases found in the file.");
  process.exit(1);
}

try {
  await pushManualCases(testCases);
} catch (err: any) {
  console.error("❌ Push failed:", err.message);
  process.exit(1);
}
