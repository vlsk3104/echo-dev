import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../constants";

export const supportAgent = new Agent(components.agent, {
  name: "Customer Support Agent",
  languageModel: openai.chat("gpt-4o-mini"),
  // ツール呼び出し中に生成されたメッセージ（assistantのtool_callsやtoolの返答）が履歴に残っていると、未解決のtool_callが文脈に混ざりプロバイダ側で
  // 「tool_callsの直後に対応するtoolメッセージが必要」という検証エラーを引き起こす場合があるため、コンテキストからツール関連メッセージを除外します。
  contextOptions: { excludeToolMessages: true },
  instructions: SUPPORT_AGENT_PROMPT,
});
