# AGENTS.md

イナバくん（稲葉勇人）のポートフォリオサイト。Next.js (Pages Router) + TypeScript + Tailwind CSS 製。
ページは `/`（トップ）・`/profile`・`/contact` の3枚と 404 のみの小さなサイト。

## 開発フロー（必読）

**main に直接コミット・push しない。** ファイルを変更する作業は必ずブランチを切り、
draft PR を作ってから始める。コミットメッセージは日本語で、冒頭に絵文字を付ける。

手順の詳細は `.claude/skills/pr-workflow/SKILL.md` に置いてある。変更作業に入る前に
`pr-workflow` スキルを読むこと。

実装が完了して push したら、**必ず Vercel のプレビュー URL をユーザーに伝える**こと
(PR コメントに Vercel bot が貼る URL、または push 後に `gh pr checks`/PR 画面から確認できる)。

## ドキュメント

| ドキュメント                            | 内容                                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------- |
| [構成](docs/architecture.md)            | 技術スタック、ディレクトリ構成、PageTemplate を起点としたレイアウト設計、`_app.jsx` の注意点 |
| [コーディング規約](docs/conventions.md) | コンポーネントの置き方、スタイリング、変更時に触ってはいけないもの                           |
| [開発](docs/development.md)             | セットアップ、npm スクリプト、CI、デプロイ                                                   |
| [Tailwind 移行メモ](docs/tailwind-migration.md) | Chakra UI から移行したときの対応表と、Chakra が暗黙に効かせていた「消すと壊れる」箇所 |

## 最低限おさえること

- App Router ではなく **Pages Router**。`src/pages/` にファイルを置くとルーティングされる
- 全ページを `src/components/common/PageTemplate/PageTemplate.tsx` で包む。`<Head>`・背景・ヘッダー・ページ遷移アニメーションはこれが持っている
- スタイルは Tailwind の class で当てる。配色とフォントは `src/styles/global.css` の `@theme` に定義したトークンから取る
- push する前に `npm run tsc && npm run lint:check && npm run format:check && npm run build`
- プロフィールの職歴・氏名などは本人の実データなので勝手に書き換えない
