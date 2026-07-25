# コーディング規約

## コンポーネントの置き方

`ComponentName/ComponentName.tsx` の1ディレクトリ1コンポーネント形式。default export。

全ページで使うものは `src/components/common/`、特定ページ専用のものは `src/components/pages/<ページ名>/` に置く。

## スタイリング

- Tailwind CSS v4。スタイルは class で当てる。コンポーネント個別の CSS ファイルは書かない
- 配色とフォントは `src/styles/global.css` の `@theme` に定義してある。`bg-background-main` / `bg-background-sub` / `font-serif` のようにトークン経由で使い、16進数を直書きしない
  - `tailwind.config.js` は無い。v4 なのでテーマは CSS 側の `@theme` が正
- レスポンシブは SP ファースト。無印がモバイルで、`md:`（768px）と `xl:`（1280px）だけを使っている
- テキストの半透明表現は `text-white/50`（旧 `rgba(255,255,255, 0.5)`）
- デザイン上の固定値（`text-[90px]`、`mt-[60px]` など）は Chakra 時代の値をそのまま引き継いでいるので任意値クラスが多い。既存の見た目を変えないための意図的なもの
- **Chakra が暗黙に効かせていたものを明示している箇所があり、消すと壊れる。** 詳細は [Tailwind 移行メモ](tailwind-migration.md) の「落とし穴」を参照
  - `body` の `font-family` / `color` / `background`（`global.css` の `@layer base`）
  - ロゴ `h1` の `font-bold`
  - 外部リンクの `target="_blank"` / `rel="noopener noreferrer"`
  - ヘッダーとドロワーの `z-[1100]` / `z-[1400]`

## import

全て相対パス（`../../components/common/PageTemplate/PageTemplate` など）。`tsconfig.json` に `@/*` のエイリアス設定はあるが未使用。

## 変更時に気をつけること

- **プロフィールの内容は本人の実データ**。`src/pages/profile/index.tsx` の職歴・スキル、`ProfileHead.tsx` の氏名・生年月日は勝手に書き換えない
- `public/google40ef8dfd6cf9110c.html` は Google Search Console の所有権確認ファイル。消さない
- OGP 画像の URL が `https://www.inabakun.com/ogp.jpg` と絶対パスで直書きされている

## 既知のTODO

コード中に `TODO:` コメントが点在している（トップの実績リスト、ロゴ、components 配下のディレクトリ構造見直し、import のエイリアス化など）。
