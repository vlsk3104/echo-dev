import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

export const escalateConversation = createTool({
  description: "Escalate a conversation",
  args: z.object({}),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }

    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId as string,
    });

    const finalMessage = "この会話はオペレーターにエスカレートされました。";

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId as string,
      message: {
        role: "assistant",
        content: finalMessage,
      },
    });

    return finalMessage;
  },
});
