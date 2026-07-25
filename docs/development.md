# 開発

## セットアップ

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で開く。Node.js は CI と揃えて 21 以上を推奨。

## コマンド

```bash
npm run dev           # 開発サーバー (http://localhost:3000)
npm run build         # プロダクションビルド
npm run start         # ビルド結果の起動

npm run tsc           # 型チェック
npm run lint:check    # Lint（CI と同じ）
npm run lint          # Lint + 自動修正
npm run format:check  # Prettier チェック（CI と同じ）
npm run format        # Prettier で整形
```

Prettier の対象は `**/*.{js,jsx,ts,tsx,json,css}`。Markdown は対象外なので、ドキュメントを整形しても CI では検査されない。

## CI

`.github/workflows/ci.yml`。main への push と main 向け PR で走る。

`type-check` / `lint-check` / `format-check` の3つが並列で回り、すべて通ったら `build-app` が実行される。push する前に以下を通せば CI と同じ検証になる。

```bash
npm run tsc && npm run lint:check && npm run format:check && npm run build
```

format で落ちたら `npm run format`、lint で落ちたら `npm run lint` で自動修正できる。

Node のバージョンは CI 側で 21 固定（`.github/composite_actions/client-setup/action.yml`）。`node_modules` は `package-lock.json` のハッシュをキーにキャッシュされる。

## デプロイ

Vercel。PR を作ると Preview デプロイが走る。
