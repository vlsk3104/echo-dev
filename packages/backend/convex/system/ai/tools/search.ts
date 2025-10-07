import { openai } from "@ai-sdk/openai";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";
import rag from "../rag";
import { SEARCH_INTERPRETER_PROMPT } from "../constants";

export const search = createTool({
  description:
    "ユーザーの質問に回答するために、ナレッジベース内から関連情報を検索します。",
  args: z.object({
    query: z.string().describe("関連情報を見つけるための検索クエリです"),
  }),
  handler: async (ctx, args) => {
    try {
      if (!ctx.threadId) {
        return "Missing thread ID";
      }

      const conversation = await ctx.runQuery(
        internal.system.conversations.getByThreadId,
        { threadId: ctx.threadId },
      );

      if (!conversation) {
        return "Conversation not found";
      }

      const orgId = conversation.organizationId;

      const searchResult = await rag.search(ctx, {
        namespace: orgId,
        query: args.query,
        limit: 5,
      });

      const contextText = `次の場所で結果が見つかりました：${searchResult.entries
        .map((e) => e.title || null)
        .filter((t) => t !== null)
        .join(", ")}。以下がそのコンテキストです：\n\n${searchResult.text}`;

      const response = await generateText({
        messages: [
          {
            role: "system",
            content: SEARCH_INTERPRETER_PROMPT,
          },
          {
            role: "user",
            content: `ユーザーの質問：「${args.query}」\n\n検索結果： ${contextText}`,
          },
        ],
        model: openai.chat("gpt-4o-mini"),
      });

      await supportAgent.saveMessage(ctx, {
        threadId: ctx.threadId,
        message: {
          role: "assistant",
          content: response.text,
        },
      });

      return response.text;
    } catch (e) {
      return "検索ツールの実行中にエラーが発生しました。クエリを変えて再試行してください。";
    }
  },
});
