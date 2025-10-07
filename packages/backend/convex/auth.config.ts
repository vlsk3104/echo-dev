/// <reference types="node" />

// ConvexのClerk設定は環境変数から読み込むのが公式推奨です。
// - 開発: `packages/backend/.env.local` に `CLERK_JWT_ISSUER_DOMAIN` を定義
// - 本番: Convex Dashboard の Environment Variables に同名で設定
// 参考: https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances

const domain = process.env.CLERK_JWT_ISSUER_DOMAIN;

if (!domain) {
  // 型エラー回避だけでなく、実行時にも明確なエラーメッセージを出す
  throw new Error(
    "CLERK_JWT_ISSUER_DOMAIN が未設定です。開発環境では packages/backend/.env.local に、" +
      "本番では Convex Dashboard の Environment Variables に設定してください。",
  );
}

export default {
  providers: [
    {
      domain,
      applicationID: "convex",
    },
  ],
};
