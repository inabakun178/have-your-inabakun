---
name: pr-workflow
description: このリポジトリでファイルを変更するとき必ず使うブランチ/PR運用。作業開始時にブランチを切ってdraft PRを作りURLを渡す → 実装 → 日本語+絵文字のコミット → push → PRを報告 → CIを監視 → 失敗やコンフリクトを解消 → マージ後はブランチを削除、までの手順。main への直接コミット・直接pushは禁止。コード・設定・ドキュメントを1行でも編集する作業なら、ユーザーが「ブランチ切って」「PR作って」と言わなくても必ずこのスキルに従うこと。
---

# ブランチ / PR ワークフロー

このリポジトリ（have-your-inabakun）では、**main に直接コミット・push しない**。
変更はすべてブランチ → draft PR → CI 通過、の流れを通す。ユーザーが変更の中身を
GitHub 上で確認できる状態を常に保つのが目的なので、「小さい変更だから」と省略しない。

## 適用範囲

- **使う**: ファイルを作成・編集・削除する作業すべて（コード、設定、ドキュメント、依存関係更新）
- **使わない**: 読むだけの調査、質問への回答、コマンドの実行結果を見るだけの作業

判断に迷ったら使う側に倒す。空の PR は閉じれば済むが、main を汚すと元に戻すのが面倒。

---

## 1. 作業開始 — ブランチと draft PR を作る

**実装に手を付ける前に**ここまで終わらせる。先に PR の器を作っておくと、ユーザーが
作業中の差分をいつでも見られるし、CI も早い段階から回り始める。

```bash
git switch main && git pull origin main
git switch -c <branch-name>
git commit --allow-empty -m "🚧 作業開始"
git push -u origin <branch-name>
gh pr create --draft --title "<絵文字> <日本語のタイトル>" --body "<本文>"
```

空コミットを挟むのは、コミットが1つもないブランチには PR を作れないため。
最後にこの空コミットを消す必要はない（履歴に残って困るものではない）。

### ブランチ名

`<type>/<英語のkebab-case>` 形式。type は下のコミット種別表と揃える。

例: `feat/webgl-fv` / `fix/header-drawer-overflow` / `chore/bump-next` / `docs/readme`

### PR 本文のテンプレート

```markdown
## 概要

<何をなぜやるか。1〜3行>

## 変更内容

- <変更点>

## 確認方法

- <動作確認の手順。UIなら見るべきページ>
```

作業中に内容が固まってきたら `gh pr edit <番号> --body` で更新する。

### ユーザーへの報告

ブランチと draft PR を作ったら、**すぐに**実装へ進む前に URL を伝える。

> ブランチ `feat/webgl-fv` を切って draft PR を作りました:
> https://github.com/inabakun178/have-your-inabakun/pull/123
> これから実装に入ります。

---

## 2. 実装してコミットする

### コミットメッセージ

**日本語**で書き、**冒頭に内容が一目でわかる絵文字**を付ける。

```
<絵文字> <何をしたか（日本語・簡潔に）>

<必要なら詳細。何をしたかではなく、なぜそうしたかを書く>

Co-Authored-By: Claude <noreply@anthropic.com>
```

| 絵文字 | type | 使う場面 |
| ------ | ----- | -------- |
| ✨ | feat | 新機能・新しいページやコンポーネント |
| 🐛 | fix | バグ修正 |
| 💄 | style | 見た目・CSS・レイアウトの調整 |
| ♻️ | refactor | 挙動を変えないコード整理 |
| 📝 | docs | README・AGENTS.md・コメント |
| ⬆️ | chore | 依存関係の更新 |
| 🔧 | chore | 設定ファイル・CI |
| ✅ | test | テストの追加・修正 |
| 🗑️ | chore | 不要なコード・ファイルの削除 |
| ⚡️ | perf | パフォーマンス改善 |
| 🔀 | chore | main の取り込み・コンフリクト解消 |

例:

- `✨ FVをWebGLで描画するように変更`
- `🐛 SPでドロワーメニューが閉じない問題を修正`
- `🗑️ プロフィールから生年月日を削除`
- `⬆️ Next.jsを14.2.3から15.1.0に更新`

粒度は「レビューする人が1つずつ読めるか」で決める。無関係な変更を1コミットに混ぜない。

### push する前にローカルで CI と同じチェックを回す

CI で落ちてから直すより速い。`.github/workflows/ci.yml` と同じ内容:

```bash
npm run tsc && npm run lint:check && npm run format:check && npm run build
```

format で落ちたら `npm run format`、lint で落ちたら `npm run lint` で自動修正できる。

---

## 3. 作業完了 — PR を報告する

push したあと、ユーザーに以下をまとめて渡す:

- PR の URL
- 何をしたかの要約
- CI の状況（次のセクション）

**draft のままにしておく**。レビュー可能にする（`gh pr ready`）のもマージするのも、
ユーザーの確認を取ってから。こちらから勝手に ready にしたりマージしたりしない。

---

## 4. CI を監視する

push したら CI が走る。結果を見ずに「終わりました」と言わない。

```bash
gh pr checks <番号> --watch
```

数分かかるので、バックグラウンド実行（`run_in_background`）にして他の作業を進めてよい。
完了したら結果を確認する。

### 落ちたとき

1. どのジョブが落ちたか特定する: `gh run view <run-id> --log-failed`
2. ローカルで同じコマンドを実行して再現する
3. 直してコミット（🐛 か 🔧）して push
4. もう一度 CI を待つ

自分の変更が原因でない失敗（flaky、既存の壊れ）だと判断したら、勝手に直さずユーザーに
状況を伝えて判断を仰ぐ。関係ない修正を PR に混ぜるとレビューが難しくなる。

---

## 5. コンフリクトを解消する

`gh pr view <番号> --json mergeable` が `CONFLICTING` のとき、または main が進んだとき。

```bash
git fetch origin main
git merge origin/main
```

rebase ではなく merge を使う。rebase は force push が必要になり、ユーザーが既に見ている
PR の履歴が書き換わるため。

コンフリクトを解決したら:

```bash
git add <解決したファイル>
git commit -m "🔀 mainを取り込んでコンフリクトを解消"
git push
```

**どちらの変更を残すか自明でない場合は、勝手に決めずにユーザーに聞く。** 特に
両方が同じ行を意図的に変えているとき、片方を捨てる判断はこちらの権限ではない。

解消後は CI をもう一度確認する（4 に戻る）。

---

## 6. マージ後 — ブランチを片付ける

マージするのはユーザーの確認を取ってから（3 参照）。**マージしたら、そのブランチは
リモートもローカルも削除する。** 残しておくと `git branch` / GitHub のブランチ一覧が
マージ済みのゴミで埋まり、どれが生きているブランチか分からなくなる。

ユーザーからマージの指示が出たら、削除まで込みで実行する:

```bash
gh pr merge <番号> --squash --delete-branch
```

`--delete-branch` はリモートブランチを消し、ローカルにもそのブランチがあれば一緒に
消してくれる。このリポジトリの main は squash マージで運用しているので `--squash`。

ユーザーが GitHub の画面上でマージした場合は、リモートは消えてもローカルが残る。
その場合は自分で片付ける:

```bash
git switch main && git pull origin main
git branch -d <branch-name>       # マージ済みなら -d で消える
git fetch --prune                 # 消えたリモートブランチの参照を掃除
```

`-d` が「マージされていない」と拒否したら、**`-D` で強制削除する前に必ず理由を確認する。**
squash マージだと git からはマージ済みに見えないことがある（この場合は消してよい）が、
本当に取り込まれていないコミットが残っているケースと区別がつかないため、
`git log --oneline origin/main..<branch-name>` で中身を見てからユーザーに伝える。

worktree で作業していた場合は、ブランチを消す前に worktree を外す:

```bash
git worktree remove <path>
```

---

## うっかり main で作業を始めてしまったとき

コミットしていなければ、変更はそのままブランチに持っていける:

```bash
git switch -c <branch-name>   # 未コミットの変更はついてくる
```

すでに main にコミットしてしまった場合（push 前）:

```bash
git switch -c <branch-name>          # コミットごとブランチに持っていく
git switch main && git reset --hard origin/main
```

`reset --hard` は作業を消す操作なので、実行前に必ず `git log --oneline origin/main..main`
で消える範囲を確認し、ユーザーに伝えてから実行する。
