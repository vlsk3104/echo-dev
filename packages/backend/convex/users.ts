import { mutation, query } from "./_generated/server";

export const qetMany = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const add = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const orgId = identity?.orgId as string;

    if (!orgId) {
      throw new Error("No organization");
    }

    return await ctx.db.insert("users", { name: "kuroda" });
  },
});
