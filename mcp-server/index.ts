import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { exec } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { promisify } from "util";

const execAsync = promisify(exec);
const server = new Server({ name: "playwright-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler("tools/list", async () => ({
  tools: [
    { name: "run_tests", description: "Run Playwright tests and return output", inputSchema: { type: "object", properties: { testFile: { type: "string" } } } },
    { name: "read_file", description: "Read a test file", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
    { name: "write_file", description: "Write fixed test content", inputSchema: { type: "object", properties: { path: { type: "string" }, content: { type: "string" } }, required: ["path", "content"] } }
  ]
}));

server.setRequestHandler("tools/call", async (req) => {
  const { name, arguments: args } = req.params;
  if (name === "run_tests") {
    try {
      const cmd = args.testFile ? `npx playwright test ${args.testFile}` : "npx playwright test";
      const { stdout, stderr } = await execAsync(cmd);
      return { content: [{ type: "text", text: stdout + stderr }] };
    } catch (e: any) {
      return { content: [{ type: "text", text: e.stdout + e.stderr }], isError: true };
    }
  }
  if (name === "read_file") {
    return { content: [{ type: "text", text: readFileSync(args.path, "utf8") }] };
  }
  if (name === "write_file") {
    writeFileSync(args.path, args.content, "utf8");
    return { content: [{ type: "text", text: "File written." }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);