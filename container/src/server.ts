import express from "express";
import { readFileSync } from "fs";
import { join } from "path";

const app = express();
app.use(express.json({ limit: "1mb" }));

// Health
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

// List server capabilities (tools/resources/prompts)
app.get("/mcp/manifest", (_req, res) => {
  res.json({
    name: "corp-mcp",
    version: "0.1.0",
    tools: [
      {
        name: "ping",
        description: "Echo back a message (read-only, safe)",
        input_schema: { type: "object", properties: { message: { type: "string" }}, required: ["message"] }
      }
    ],
    resources: [
      { name: "design-system", uri: "/resources/design-system", description: "Internal design system (static)" }
    ],
    prompts: [
      { name: "secure-terraform", uri: "/prompts/secure-terraform" }
    ]
  });
});

// Tool invocation (simple sync reply)
app.post("/mcp/tools/ping", (req, res) => {
  const msg = String(req.body?.message ?? "");
  res.json({ output: `pong: ${msg}` });
});

// Static “resource” example (you’d proxy or fetch from a real system instead)
app.get("/resources/design-system", (_req, res) => {
  res.type("text/plain").send("Design tokens v1.0 (read-only).");
});

// Prompts served from mounted folder
app.get("/prompts/secure-terraform", (_req, res) => {
  try {
    const p = readFileSync(join("/app/prompts", "secure-terraform.md"), "utf8");
    res.type("text/markdown").send(p);
  } catch {
    res.status(404).send("Prompt not found");
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`MCP server listening on :${port}`));
