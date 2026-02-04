import { ChatOllama } from "@langchain/ollama";
import { MessagesAnnotation, StateGraph, START, END } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import config from "./config.js";
import { buildTools } from "./tools.js";
import { createAgentNode } from "./nodes.js";

const tools = buildTools();

const model = new ChatOllama({
  baseUrl: config.ollamaHost,
  model: config.modelName,
  temperature: config.modelTemperature,
  streaming: true,
});

const modelWithTools = model.bindTools(tools);
const agentNode = createAgentNode(modelWithTools);
const toolNode = new ToolNode(tools);

const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", agentNode)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", toolsCondition, ["tools", END])
  .addEdge("tools", "agent")
  .compile();

export { graph, tools, modelWithTools };
