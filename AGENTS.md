# AGENTS.md

イナバくん（稲葉勇人）のポートフォリオサイト。AI エージェント向けの構成メモ。

## 技術スタック

| 種別           | 内容                                   |
| -------------- | -------------------------------------- |
| フレームワーク | Next.js 14 (Pages Router)              |
| 言語           | TypeScript 5.4 (`strict: true`)        |
| UI             | Chakra UI v2 + Emotion                 |
| アニメーション | Framer Motion, react-animated-cursor   |
| Lint/Format    | ESLint (eslint-config-next) + Prettier |
| CI             | GitHub Actions                         |

App Router ではなく **Pages Router** を使っている。`src/pages/` にファイルを置くとルーティングされる。

## ディレクトリ構成

```
src/
├── pages/                      # ルーティング（Pages Router）
│   ├── _app.jsx                # 全ページ共通のProvider。※ここだけ .jsx
│   ├── index.tsx               # トップ（/）
│   ├── 404.tsx                 # 404ページ
│   ├── profile/index.tsx       # /profile
│   └── contact/index.tsx       # /contact
├── components/
│   ├── common/                 # 全ページで使う共通コンポーネント
│   │   ├── PageTemplate/       # 全ページのレイアウト土台（後述）
│   │   ├── HeaderNavigation/   # ヘッダー + SPのドロワーメニュー
│   │   └── SnsList/            # 右下に固定表示するSNSアイコン
│   └── pages/                  # 特定ページ専用のコンポーネント
│       ├── top/Fv/             # トップのファーストビュー
│       └── profile/            # ProfileHead, TextListArea
├── lib/
│   ├── colors.ts               # 配色定数 COLORS
│   └── chakraTheme.ts          # Chakra のテーマ（フォント指定のみ）
└── styles/global.css           # グローバルCSS（::selection のみ）

public/                         # 画像・favicon・Search Console 認証ファイル
.github/
├── workflows/ci.yml            # CI
├── composite_actions/client-setup/  # CI 共通のセットアップ処理
└── dependabot.yml              # npm を月次で更新
```

コンポーネントは `ComponentName/ComponentName.tsx` の1ディレクトリ1コンポーネント形式。default export。

## 主要な設計

### PageTemplate がすべての起点

`src/components/common/PageTemplate/PageTemplate.tsx` が全ページのレイアウトを担っている。新しいページを足すときは必ずこれで包む。

```tsx
<PageTemplate pageTitle="Profile">{/* ページ本体 */}</PageTemplate>
```

`PageTemplate` の責務:

- `<Head>` … `{pageTitle} | Have Your Inabakun` のタイトル、description、OGP、Google Fonts (Playfair Display) の読み込み
- 背景（`public/site_bg.svg` を `position: fixed` + グレースケール）
- `HeaderNavigation` と `SnsList` の描画
- Framer Motion によるページ遷移のフェード

`pageTitle` は任意。省略するとタイトルは `Have Your Inabakun` のみになる（トップページがこれ）。

### スタイリングの決めごと

- CSS ファイルは書かず、Chakra UI の props でスタイルを当てる
- 色は直書きせず `src/lib/colors.ts` の `COLORS` を使う
- レスポンシブは Chakra のブレークポイントオブジェクト記法で書く。SP ファーストで `{ base: "...", md: "..." }` が基本形
- テキストの半透明表現は `rgba(255,255,255, 0.5)` が各所で直書きされている（`COLORS` 化されていない既知の不統一）

### `_app.jsx` の注意点

- このファイルだけ TypeScript ではなく **`.jsx`**。`AppProps` の型付けがコメントアウトされたまま残っている
- `react-animated-cursor` は `next/dynamic` の `ssr: false` で読み込む必要がある（SSR で落ちるため）
- ページ遷移アニメーションのため `AnimatePresence mode="wait"` で `<Component>` を包んでいる

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

## CI

`.github/workflows/ci.yml`。main への push と main 向け PR で走る。

`type-check` / `lint-check` / `format-check` の3つが並列で回り、すべて通ったら `build-app` が実行される。ローカルでは以下を通してからコミットすれば CI と同じ検証になる。

```bash
npm run tsc && npm run lint:check && npm run format:check && npm run build
```

Node のバージョンは CI 側で 21 固定（`.github/composite_actions/client-setup/action.yml`）。

## 変更時に気をつけること

- **プロフィールの内容は本人の実データ**。`src/pages/profile/index.tsx` の職歴・スキル、`ProfileHead.tsx` の氏名・生年月日は勝手に書き換えない
- `public/google40ef8dfd6cf9110c.html` は Google Search Console の所有権確認ファイル。消さない
- OGP 画像の URL が `https://www.inabakun.com/ogp.jpg` と絶対パスで直書きされている
- import は全て相対パス（`../../../lib/colors` など）。`tsconfig.json` に `@/*` のエイリアス設定はあるが未使用

## 既知のTODO

コード中に `TODO:` コメントが点在している（トップの実績リスト、ロゴ、components 配下のディレクトリ構造見直し、import のエイリアス化など）。
