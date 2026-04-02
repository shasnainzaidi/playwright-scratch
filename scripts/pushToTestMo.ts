import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const BASE_URL = process.env.TESTMO_BASE_URL!;
const TOKEN = process.env.TESTMO_API_TOKEN!;

const PROJECT_ID = 1;
const GROUP_ID = 1;
const REPOSITORY_ID = 1;

async function createTestCases(testCases: any[]) {
  try {
    const formattedCases = testCases.map(tc => ({
      name: String(tc.title), // ✅ FIXED
      repository_id: REPOSITORY_ID,
      group_id: GROUP_ID,
      priority: 3,

      steps: tc.steps?.map((s: any) => ({
        content: String(s.step || s.content || "Step"),
        expected: String(s.expected || "Expected result")
      })) || [
        {
          content: "Step not defined",
          expected: "Expected result"
        }
      ]
    }));

    await axios.post(
      `${BASE_URL}/api/v1/projects/${PROJECT_ID}/cases`,
      {
        cases: formattedCases // ✅ BATCH UPLOAD
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(`✅ Successfully created ${formattedCases.length} test cases`);
  } catch (error: any) {
    console.error("❌ Batch creation failed");
    console.error(error.response?.data || error.message);
  }
}

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log("Provide JSON file path");
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");

  let testCases;

  try {
    testCases = JSON.parse(raw);
  } catch (e) {
    console.error("❌ Invalid JSON format");
    process.exit(1);
  }

  await createTestCases(testCases);
}

main();