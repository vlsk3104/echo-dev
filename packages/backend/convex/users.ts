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
    const userId = await ctx.db.insert("users", { name: "kuroda" });
    return userId;
  },
});
