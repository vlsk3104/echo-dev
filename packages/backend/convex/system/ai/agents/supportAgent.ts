import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "Customer Support Agent",
  languageModel: openai.chat("gpt-4o-mini"),
  instructions: "あなたはカスタマーサポート担当者です",
});
