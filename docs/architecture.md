# 構成

## 技術スタック

| 種別           | 内容                                   |
| -------------- | -------------------------------------- |
| フレームワーク | Next.js 14 (Pages Router)              |
| 言語           | TypeScript 5.4 (`strict: true`)        |
| UI             | Tailwind CSS v4                        |
| アニメーション | Framer Motion, react-animated-cursor   |
| Lint/Format    | ESLint (eslint-config-next) + Prettier |
| CI             | GitHub Actions                         |
| デプロイ       | Vercel                                 |

App Router ではなく **Pages Router** を使っている。`src/pages/` にファイルを置くとルーティングされる。

## ディレクトリ構成

```
src/
├── pages/                      # ルーティング（Pages Router）
│   ├── _app.jsx                # 全ページ共通の入口。※ここだけ .jsx
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
└── styles/global.css           # Tailwind の読み込み + @theme（配色・フォント）+ ::selection

postcss.config.mjs              # Tailwind の PostCSS プラグイン
public/                         # 画像・favicon・Search Console 認証ファイル
.github/
├── workflows/ci.yml            # CI
├── composite_actions/client-setup/  # CI 共通のセットアップ処理
└── dependabot.yml              # npm を月次で更新
```

## PageTemplate がすべての起点

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

## `_app.jsx` の注意点

- このファイルだけ TypeScript ではなく **`.jsx`**。`AppProps` の型付けがコメントアウトされたまま残っている
- `react-animated-cursor` は `next/dynamic` の `ssr: false` で読み込む必要がある（SSR で落ちるため）
- ページ遷移アニメーションのため `AnimatePresence mode="wait"` で `<Component>` を包んでいる
