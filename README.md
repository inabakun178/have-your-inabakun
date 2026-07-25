# Have Your Inabakun?

イナバくん（稲葉勇人 / Hayato Inaba）のポートフォリオサイトです。

🔗 [https://www.inabakun.com/](https://www.inabakun.com/)

## 技術スタック

- [Next.js 16](https://nextjs.org/) (Pages Router)
- [React 19](https://react.dev/) / [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Framer Motion](https://www.framer.com/motion/) — ページ遷移アニメーション
- [react-animated-cursor](https://github.com/stephenscaff/react-animated-cursor) — カスタムカーソル
- pnpm / ESLint / Prettier / GitHub Actions

## セットアップ

```bash
pnpm install
pnpm run dev
```

[http://localhost:3000](http://localhost:3000) で開きます。

> Node.js は CI と揃えて 20.9 以上を推奨。

## コマンド

| コマンド                | 内容                             |
| ----------------------- | -------------------------------- |
| `pnpm run dev`          | 開発サーバーを起動               |
| `pnpm run build`        | プロダクションビルド             |
| `pnpm run start`        | ビルド結果を起動                 |
| `pnpm run tsc`          | 型チェック                       |
| `pnpm run lint:check`   | Lint（修正なし）                 |
| `pnpm run lint`         | Lint + 自動修正                  |
| `pnpm run format:check` | Prettier のフォーマットチェック  |
| `pnpm run format`       | Prettier で整形                  |

## ページ構成

| パス       | 内容                                       |
| ---------- | ------------------------------------------ |
| `/`        | トップ（ファーストビュー）                 |
| `/profile` | プロフィール、スキル、経歴                 |
| `/contact` | お問い合わせ（現在は Twitter DM への案内） |

## ディレクトリ構成

```
src/
├── pages/        # ルーティング（Pages Router）
├── components/
│   ├── common/   # 全ページ共通のコンポーネント
│   └── pages/    # 各ページ専用のコンポーネント
├── lib/          # 配色定数、Tailwind のテーマ設定
└── styles/       # グローバルCSS
public/           # 画像・favicon など静的ファイル
```

詳しい構成や開発ルールは [AGENTS.md](AGENTS.md) を参照してください。

## CI

main への push / PR で GitHub Actions が走ります（型チェック・Lint・フォーマットチェックが通ったらビルド）。ローカルでは以下で同じ内容を確認できます。

```bash
pnpm run tsc && pnpm run lint:check && pnpm run format:check && pnpm run build
```
