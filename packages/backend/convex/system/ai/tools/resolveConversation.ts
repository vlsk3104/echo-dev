import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

export const resolveConversation = createTool({
  description: "Resolve a conversation",
  args: z.object({}),
  handler: async (ctx, args) => {
    try {
      if (!ctx.threadId) {
        return "Missing thread ID";
      }

      await ctx.runMutation(internal.system.conversations.resolve, {
        threadId: ctx.threadId as string,
      });

      const finalMessage = "この会話は、解決済みになりました。";

      await supportAgent.saveMessage(ctx, {
        threadId: ctx.threadId as string,
        message: {
          role: "assistant",
          content: finalMessage,
        },
      });

      return finalMessage;
    } catch (e) {
      // ツール呼び出しの失敗で関数がthrowすると、LLMへのtool応答が欠落しうるため必ず文字列を返す
      return "解決処理でエラーが発生しました。しばらくして再試行してください。";
    }
  },
});
