# PROGRESS

## 2026-10-13 / Codespaces

- PLAN.mdの作業1〜4を実施。既存のPLAN.md・package.json・テストを利用し、元資料は変更していない。
- 実装: HTML/JavaScriptの単一画面、締切順一覧、残り日数、入力検査、完了による削除、localStorage保存、Node.js静的サーバー、PR用CI。
- 対象外の通知・共有・ログイン・DB・公開は追加していない。commit・pushは行っていない。

## 実行した確認と証拠

- 実装前の`npm test`: モジュール未作成によるERR_MODULE_NOT_FOUNDを確認。
- 実装後の`npm test`: 7件成功。HTTP配信テスト追加後は8件成功。
- 最終確認: リポジトリを明示した`npm --prefix /workspaces/hackathon-for-student-20261017-3 test`で11件成功、失敗・Skippedなし。C2〜C4、うるう年・年越し・不正日付・ローカル日付、配信のContent-Type・404・405・HEADを確認。CIも同じ`npm test`を使用する。
- PR確認: [PR #1](https://github.com/mrmo-sandbox/hackathon-for-student-20261017-3/pull/1)（base `main`、head `feat/deadline-list`）を作成。GitHub Actionsの`Tests`が成功。実行結果: https://github.com/mrmo-sandbox/hackathon-for-student-20261017-3/actions/runs/38543188602/job/115782711177
- `npm start`: ポート3000で起動成功。ChromiumからHTTPで画面・モジュールを読み込み、画面のJavaScriptエラーなし。
- Playwright/Chromiumの実画面操作: 幅1280pxと375px、Asia/Tokyo、今日を2026-10-13に固定してC1〜C6を確認。順不同で4課題を追加し、期限切れ→今日→あと1日→あと7日の順で表示。再読み込み後4件保持、完了後は再読み込みしても3件。
- 追加検証: 空の課題名・締切日では理由を表示して0件のまま。HTML風の課題名は文字として表示。長い課題名で横はみ出し・ボタンとの重なりなし。保存失敗を模擬し、エラー表示・入力保持・一覧の件数維持を確認。
- 日本語フォントを使ったPC・スマートフォンのスクリーンショットも確認。証拠は`/tmp/deadline-final-1280.png`と`/tmp/deadline-final-375.png`（このCodespacesの一時ファイル、Gitには含めない）。
- ブラウザ検証は一時領域のPlaywrightと共有ライブラリを使用。最初はライブラリ不足で起動失敗したが、一時領域へ展開して再実行成功。日本語フォントもユーザー領域に追加。アプリの外部依存やシステム設定は追加・変更していない。
- テスト再実行時に一時領域のcwdでENOENTが発生したため、上記`--prefix`でリポジトリを指定して再実行し成功した。

## 完成条件の状態

| 条件 | 状態 | 根拠 |
| --- | --- | --- |
| C1 追加 | 確認済み | 両画面幅で入力・追加・一覧表示 |
| C2 締切順 | 確認済み | 単体テストと順不同の画面追加 |
| C3 日数・今日・期限切れ | 確認済み | 単体テスト、実画面、大表示の画像確認 |
| C4 入力検査 | 確認済み | 単体テストと実画面のエラー確認 |
| C5 完了 | 確認済み | 完了後・再読み込み後に一覧から削除 |
| C6 保存 | 確認済み | 再読み込み後に4件保持 |
| C7 学生の主要操作 | 未確認 | 学生の操作結果は未取得 |
| C8 PRのCI実行 | 確認済み | [PR #1](https://github.com/mrmo-sandbox/hackathon-for-student-20261017-3/pull/1)の`Tests`成功（2026-10-14） |

既知の機能未達はなし。ただしC7・C8が未確認のため、全条件達成とは扱わない。締切に気づきやすくなるという利用者への効果も未検証。

## 次の作業

1. CodespacesのPortsで3000をPrivateのままブラウザで開き、PLAN.mdの手動確認を学生が実施する。結果・問題があればこの記録へ追記する。
2. チームでPR #1の差分を確認し、学生のC7操作結果を追記する。レビュー後にマージ判断する。
3. C7で問題が見つかった場合は同じブランチで修正し、テストとPRのCIを再確認する。対象外の追加は合意を得てから。