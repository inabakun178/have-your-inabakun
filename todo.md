# TODO

## ドキュメント

- [ ] README 更新

## 依存関係

- [x] ライブラリ更新（Next.js / React / 各種依存パッケージ）

## サイトデザインリニューアル

- [x] FV を WebGL でかっこよくする
- [x] 問い合わせ導線を SNS に変更する
- [x] 実績・プロフィールの内容を更新する
- [x] 生年月日を消す

## favicon / アイコン

- [x] favicon を最新化する（現状 `public/favicon.ico` のみ）
- [ ] SVG favicon・apple-touch-icon・192/512px の PNG を追加する
- [ ] `site.webmanifest` を追加して PWA アイコン・テーマカラーを設定する

## OGP / SEO

- [ ] OGP 画像（`public/ogp.jpg`）を新デザインに合わせて更新する
- [x] 不足している OGP タグを追加する（`og:type` / `og:url` / `og:site_name` / `og:locale`）
- [x] `og:description` が `name=` になっているので `property=` に修正する（[PageTemplate.tsx:30](src/components/common/PageTemplate/PageTemplate.tsx:30)）
- [x] Twitter Card タグを追加する（`twitter:card` / `twitter:site` など）
- [x] ページごとの description・OGP を出し分けられるようにする（現状は全ページ共通の固定文言）
- [x] canonical URL を出力する
- [x] `robots.txt` と `sitemap.xml` を生成する
- [x] 構造化データ（JSON-LD / Person・WebSite）を追加する
- [x] `_document` を追加して `<html lang="ja">` を設定する

## 開発基盤

- [x] CI を作る（テスト、lint、型チェック、build）
- [x] Chakra UI から Tailwind CSS に移行する（対応表と落とし穴は [docs/tailwind-migration.md](docs/tailwind-migration.md)）
