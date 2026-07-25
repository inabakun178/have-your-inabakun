# Chakra UI → Tailwind CSS 移行メモ

`todo.md` の「Chakra UI から Tailwind CSS に移行する」の記録。**見た目を変えない**方針で、
Chakra の props に入っていた値をそのまま Tailwind の utility に写した。

前提として、pnpm 移行と依存更新（Next 16 / React 19 / ESLint 9 flat config）が先に main に入っている。
Next 16 前提なので Tailwind は **v4**（`tailwind.config.js` を持たず、テーマは CSS の `@theme`）。

## 何を削って何を入れたか

| 削除                                                            | 追加                                      |
| --------------------------------------------------------------- | ----------------------------------------- |
| `@chakra-ui/react`<br>`@emotion/react`<br>`@emotion/styled`      | `tailwindcss`<br>`@tailwindcss/postcss`   |
| `src/lib/chakraTheme.ts`（フォント指定）<br>`src/lib/colors.ts`（`COLORS`） | `postcss.config.mjs`<br>`src/styles/global.css` の `@theme` |

`src/lib/` はこれで空になったので消えた。framer-motion は維持（ページ遷移と `AnimatePresence`）。

配色とフォントの正は `src/styles/global.css` の `@theme` に移った。`COLORS.text.main`（`#fff`）は
Tailwind の `white` で足りるので廃止。`COLORS.text.accent`（`#E35800`）は**移行前からどこからも
使われていなかった**が、値は `--color-text-accent` として引き継いである。

## ブレークポイント

Chakra と Tailwind で px 値が一致したので、そのまま置き換えられた。

| 記法          | Chakra v2     | Tailwind |
| ------------- | ------------- | -------- |
| `base` / 無印 | 0             | 0        |
| `md`          | 48em = 768px  | 768px    |
| `xl`          | 80em = 1280px | 1280px   |

`TextListArea` だけ `display` の切り替えが `xl`、`minW` の切り替えが `md` と**混在している**ので、
まとめて `md:` にしないよう注意。

## 落とし穴（Chakra が暗黙に効かせていたもの）

移行で失われるので明示的に補った。**消すと壊れる。**

| 箇所                             | Chakra では                                  | 今の書き方                                          |
| -------------------------------- | -------------------------------------------- | --------------------------------------------------- |
| `body` の文字色・背景・フォント  | `CSSReset` が当てていた                      | `global.css` の `@layer base`                        |
| ロゴ `h1` の太字                 | `Heading` の `fontWeight: bold`              | `font-bold` を明示（Tailwind の preflight が heading をリセットする） |
| SNS リンクの `target` / `rel`    | `<Link isExternal>` が自動で付与             | `target="_blank" rel="noopener noreferrer"` を手書き |
| ハンバーガーの 40×40             | `Button` (size md) の `h: 10` / `minW: 10`   | `h-10 w-10`                                          |
| ヘッダーの重ね順                 | `zIndex="sticky"` = 1100                     | `z-[1100]`（Tailwind の既定スケールに無い）          |
| ドロワーの重ね順                 | `zIndices.modal` = 1400                      | `z-[1400]`                                           |
| ドロワー本体の padding           | `DrawerBody` の `py: 2, px: 6` = 8px 24px    | `px-6 py-2`（`p-6` ではない）                        |
| 閉じるボタンの位置               | `DrawerCloseButton` の `top: 2` / `insetEnd: 3` | `top-2 right-3`                                   |

一致していて対応不要だったもの: リストの bullet 除去（Chakra の `List` も Tailwind の preflight も
`list-style: none`）、`p` の margin 除去、`img` の `display: block` + `max-width: 100%`、
`body` の `line-height: 1.5`。

`background.sub` は `rgba(1, 1, 1, 0.5)` で、**`#000` や `#111` の半透明ではない**（`rgb(1,1,1)`）。
`black/50` で代用すると変わるので `--color-background-sub` としてトークンにしてある。

## ドロワーを自前実装にした理由と中身

`@headlessui/react` を入れるより手書きを選んだ。リンク2本のメニューで、依存3つを削る PR で
依存を増やすのは本末転倒なため。Chakra の `Drawer` が持っていた挙動は以下で代替している。

| 挙動                       | Chakra                      | 今の実装                                    |
| -------------------------- | --------------------------- | ------------------------------------------- |
| 開閉状態                   | `useDisclosure()`           | `useState`                                  |
| Esc で閉じる               | `closeOnEsc`                | `keydown` を購読                             |
| 背面のスクロール固定       | `blockScrollOnMount`        | `document.body.style.overflow`               |
| 閉じたときのフォーカス復帰 | `finalFocusRef`             | `openButtonRef.current?.focus()`             |
| 開いたときの初期フォーカス | あり                        | `closeButtonRef.current?.focus()`            |
| ARIA                       | 自動                        | `role="dialog"` / `aria-modal` / `aria-label` |
| 重ね合わせの回避           | Portal で `body` 直下へ     | `<header>` の外に出す（下記）                |

**ドロワーを `<header>` の外に出しているのは重ね合わせコンテキストの問題。** `<header>` は
`sticky` + `z-[1100]` を持つので重ね合わせコンテキストを作ってしまい、中にドロワーを置くと
`z-[1400]` が `<header>` の中でしか効かず、後ろの `SnsList`（`z-[1100]`）の下に潜る。
Chakra はこれを Portal で回避していた。同じ階層に出せば 1400 > 1100 で正しく前に出る。

リンククリック時にも `onClose` を呼ぶ（スクロールロックを残さないため）。

## 検証結果

`pnpm tsc && pnpm lint:check && pnpm format:check && pnpm build` はすべて通る。

見た目は **main と自分のブランチを同じ Next バージョンでローカルに立てて、同じ要素の座標・サイズ・
フォント・余白を実測して突き合わせた。** 巨大な `site_bg.svg` のせいでスクロール後の
スクリーンショットが再描画されず目視比較が当てにならなかったため。

desktop（1280×720）/ mobile（375×812）の両方で、以下がすべて **1px も差が無い**ことを確認した。

- `docHeight`、ヘッダーの `sticky` 領域、ロゴ、ナビリンク
- `ProfileHead` のパネルと2つのテキスト、`TextListArea` のタイトル・リスト・各項目
- プロフィール画像、SNS アイコンの位置とサイズ
- FV の `min-height`（620px / 762px）と画像サイズ、`mix-blend-mode: difference`
- 固定背景 `::before`（`fixed` / 100vw×100vh / `grayscale(1)` / `cover` / `50% 50%`）
- ドロワーのリンク位置（y=299 / y=436）、閉じるボタン（8px / 12px、40×40）、padding

ドロワーは Esc・リンククリックの両方で閉じ、`body` の `overflow` が元に戻り、フォーカスが
ハンバーガーに返り、`aria-expanded` が `false` に戻ることも確認した。

## 既知の差分・引き継ぎ

- **ドロワーの開閉アニメーションが無くなった。** Chakra の `Drawer` は既定で右からスライドインしていたが、
  自前実装は即時表示。framer-motion で再現できるが、下記の理由で見送っている
- **ページ遷移のフェードインが極端に遅い（移行前から）。** `PageTemplate` の `motion.div` が
  `opacity: 0` 付近で何秒も止まる。**main（Chakra のまま）でも同じ症状が出るので、この移行とは無関係。**
  3.9MB ある `site_bg.svg`（フィルタ付き）のデコードがメインスレッドを塞いで framer-motion の
  rAF が進まないのが原因と見ている。別で追う必要がある
- `text-white/50` は Tailwind v4 が `oklab(...)` で出力する。sRGB の `rgba(255,255,255,0.5)` と
  見た目は同じだが、computed style の文字列は変わる
- `<img>` を使っているため `@next/next/no-img-element` を3箇所で `eslint-disable` している。
  svg / png をそのまま出したいので `next/image` は使っていない
- `PageTemplate` の Google Fonts `<link>` に対する `@next/next/no-page-custom-font` の警告は移行前から出ている
