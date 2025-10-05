import { ConvexError, v } from "convex/values";
import { action } from "../_generated/server";
import {
  contentHashFromArrayBuffer,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
} from "@convex-dev/rag";
import { extractTextContent } from "../lib/extractTexContent";
import rag from "../system/ai/rag";

function guessMimeType(filename: string, bytes: ArrayBuffer): string {
  return (
    guessMimeTypeFromExtension(filename) ||
    guessMimeTypeFromContents(bytes) ||
    "application/octet-stream"
  );
}

export const addFile = action({
  args: {
    filename: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identify = await ctx.auth.getUserIdentity();

    if (identify === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identify.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const { bytes, filename, category } = args;

    const mimeType = args.mimeType || guessMimeType(filename, bytes);
    const blob = new Blob([bytes], { type: mimeType });

    const storageId = await ctx.storage.store(blob);

    const text = await extractTextContent(ctx, {
      storageId,
      filename,
      bytes,
      mimeType,
    });

    const { entryId, created } = await rag.add(ctx, {
      namespace: orgId,
      text,
      key: filename,
      title: filename,
      metadata: {
        storageId,
        uploadedBy: orgId,
        filename,
        category: category ?? null,
      },
      contentHash: await contentHashFromArrayBuffer(bytes), // To avoid re-inserting if the file content hasn't
    });

    if (!created) {
      console.debug("entry already exists skipping upload metadata");
      await ctx.storage.delete(storageId);
    }

    return {
      url: await ctx.storage.getUrl(storageId),
      entryId,
    };
  },
});
