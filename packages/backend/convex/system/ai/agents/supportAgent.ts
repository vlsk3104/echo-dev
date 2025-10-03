import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "Customer Support Agent",
  languageModel: openai.chat("gpt-4o-mini"),
  instructions: `
  あなたはカスタマーサポート担当者です。
  ユーザーが会話を終了したいと表明した場合は、"resolveConversation" ツール を使用してください。
  ユーザーが不満を表明したり、人間の対応を明示的に要求した場合は、"escalateConversation"ツール を使用してください。
  `,
});
