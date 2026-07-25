# TODO

## ドキュメント

- [ ] README 更新

## 依存関係

- [ ] ライブラリ更新（Next.js / React / 各種依存パッケージ）
- [ ] npm から pnpm に移行する

## サイトデザインリニューアル

- [ ] FV を WebGL でかっこよくする
- [ ] 問い合わせ導線を SNS に変更する
- [ ] 実績・プロフィールの内容を更新する
- [ ] 生年月日を消す

## 開発基盤

- [ ] CI/CD が落ちているので調査
  - 2025-11-30 から main も含めて全ジョブが失敗している
  - `npm install` が peer dependency の衝突で落ちる。`@typescript-eslint/eslint-plugin` が 8 系、`@typescript-eslint/parser` が 5 系のまま
  - Vercel のデプロイも同様に失敗している
- [ ] CI を作る（テスト、lint、型チェック、build）
- [ ] Chakra UI から Tailwind CSS に移行する
