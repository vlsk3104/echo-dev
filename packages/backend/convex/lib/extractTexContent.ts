import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { StorageActionWriter } from "convex/server";
import {} from "convex-helpers";
import { Id } from "../_generated/dataModel";
import { assert } from "convex-helpers";

const AI_MODULES = {
  image: openai.chat("gpt-4o-mini"),
  pdf: openai.chat("gpt-4o"),
  html: openai.chat("gpt-4o"),
} as const;

const SUPPORT_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
] as const;

const SYSTEM_PROMPTS = {
  image:
    "画像をテキストに変換します。ドキュメントの写真であれば文字起こしを行い、ドキュメントでなければ内容を説明します。",
  pdf: "PDFファイルをテキストに変換します。",
  html: "コンテンツをMarkdownに変換します。",
};

export type ExtractTextContentArgs = {
  storageId: Id<"_storage">;
  filename: string;
  bytes?: ArrayBuffer;
  mimeType: string;
};

export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs,
): Promise<string> {
  const { storageId, filename, bytes, mimeType } = args;

  const url = await ctx.storage.getUrl(storageId);
  assert(url, "Failed to get storage URL");

  if (SUPPORT_IMAGE_TYPES.some((type) => type === mimeType)) {
    return await extractImageText(url);
  }

  if (mimeType.toLowerCase().includes("pdf")) {
    return await extractPdfText(url, mimeType, filename);
  }

  if (mimeType.toLowerCase().includes("text")) {
    return await extractTextFileContent(ctx, storageId, bytes, mimeType);
  }

  throw new Error(`Unsupported MIME type: ${mimeType}`);
}

async function extractTextFileContent(
  ctx: { storage: StorageActionWriter },
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mimeType: string,
): Promise<string> {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());

  if (!arrayBuffer) {
    throw new Error("Failed to get file content");
  }

  const text = new TextDecoder().decode(arrayBuffer);

  if (mimeType.toLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODULES.html,
      system: SYSTEM_PROMPTS.html,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text },
            {
              type: "text",
              text: "テキストを抽出し、説明なしでMarkdown形式で出力してください。",
            },
          ],
        },
      ],
    });

    return result.text;
  }

  return text;
}

async function extractPdfText(
  url: string,
  mimeType: string,
  filename: string,
): Promise<string> {
  const result = await generateText({
    model: AI_MODULES.pdf,
    system: SYSTEM_PROMPTS.pdf,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: new URL(url),
            mediaType: mimeType,
            filename,
          },
          {
            type: "text",
            text: "PDFからテキストを抽出し、説明なしでそのまま出力してください。",
          },
        ],
      },
    ],
  });

  return result.text;
}

async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODULES.image,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  });

  return result.text;
}
