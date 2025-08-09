import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { select } from '@inquirer/prompts';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const mcp = new Client({
  name: "test-video",
  version: "1.0.0",
},
{
  capabilities: {
    tools: {},
    prompts: {},
    resources: {}
  }
}
);

const transport = new StdioClientTransport({
  command: "node",
  args: ["build/server.js"],
  stderr: "ignore"
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
})

async function main() {
  await mcp.connect(transport);
  const [{ tools }, { prompts }, { resources }, { resourceTemplates }] = 
  await Promise.all([
    mcp.listTools(),
    mcp.listPrompts(),
    mcp.listResources(),
    mcp.listResourceTemplates()
  ]);

  console.log("You are connected");
  while (true) {
    const option = await select(
      {
        message:"What would you like to do",
        choices: ["Query", "Tools", "Resources", "Prompts"]
      })

      switch (option) {
        case "Tools":
          const toolName = await select({
            message: "Select a tool",
            choices: tools.map(tool => ({
              name: tool.annotations?.title || tool.name,
              value: tool.name,
              description: tool.description
            }))
          })
          console.log(toolName);
      }
  }
}

main()