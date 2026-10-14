# PROGRESS

## 2026-10-13 / Codespaces

- PLAN.mdの作業1〜4を実施。既存のPLAN.md・package.json・テストを利用し、元資料は変更していない。
- 実装: HTML/JavaScriptの単一画面、締切順一覧、残り日数、入力検査、完了による削除、localStorage保存、Node.js静的サーバー、PR用CI。
- 対象外の通知・共有・ログイン・DB・公開は追加していない。commit・pushは行っていない。

## 実行した確認と証拠

- 実装前の`npm test`: モジュール未作成によるERR_MODULE_NOT_FOUNDを確認。
- 実装後の`npm test`: 7件成功。HTTP配信テスト追加後は8件成功。
- 最終確認: リポジトリを明示した`npm --prefix /workspaces/hackathon-for-student-20261017-3 test`で11件成功、失敗・Skippedなし。C2〜C4、うるう年・年越し・不正日付・ローカル日付、配信のContent-Type・404・405・HEADを確認。CIも同じ`npm test`を使用する。
- PR確認: [PR #1](https://github.com/mrmo-sandbox/hackathon-for-student-20261017-3/pull/1)（base `main`、head `feat/deadline-list`）を作成・マージ。GitHub Actionsの`Tests`が成功。実行結果: https://github.com/mrmo-sandbox/hackathon-for-student-20261017-3/actions/runs/38543320926/job/115783153973
- C7手動確認（2026-10-14 / Codespaces）: 学生がPLAN.mdのC1〜C6を操作し、想定通りと報告。個別の入力値・結果の詳細は未記録。
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
| C7 学生の主要操作 | 確認済み | 学生がC1〜C6を操作し、想定通りと報告（個別の入力値・結果の詳細は未記録） |
| C8 PRのCI実行 | 確認済み | [PR #1](https://github.com/mrmo-sandbox/hackathon-for-student-20261017-3/pull/1)の`Tests`成功（2026-10-14） |

既知の機能未達はなく、完成条件C1〜C8は確認済み。締切に気づきやすくなるという利用者への効果は未検証。

## 次の作業

1. READMEの手順8に沿って発表し、完成条件の確認結果と未検証の利用者効果を区別して説明する。
2. 発表や利用者から問題・改善要望が出た場合は、チームで合意して最新の`main`から新しい作業ブランチを作り、PLAN.mdと実装・確認を更新する。

## 2026-10-14 / Azure公開準備

- Azure Container Apps公開をユーザーが選択。マージ済みmainから`feat/azure-container-apps`を作成し、C7記録と公開準備を同じ作業ブランチで更新中。
- `Dockerfile`、`.dockerignore`、`.github/workflows/publish-container.yml`を追加。ドキュメントと企画PDFはコンテナのbuild contextから除外。
- Codespacesで`docker build --platform linux/amd64 -t deadline-list:local .`成功。`docker run --rm deadline-list:local npm test`は11件成功。
- 同じイメージを起動し、`127.0.0.1:8080`へのHTTP応答200と`/app.js`の配信を確認。検証コンテナは停止済み。
- 未確認: 公開WorkflowのGitHub Actions実行、GHCRへのpush・Public化、Azureリソース・公開URL。CodespacesにはAzure CLIがないため、Azure側操作はガイドどおりCloud Shellを使う。費用・クレジット・リージョン・権限も未確認。

### Azure公開準備後の作業

1. [PR #2](https://github.com/mrmo-sandbox/hackathon-for-student-20261017-3/pull/2)をチームで確認し、マージする。`Tests`は成功。CodeQLは状態不明のため成功扱いにしていない。
2. GHCRのPublic化がチーム合意された場合のみ、既定ブランチの手動Workflowを実行し、digestを記録する。Public化は元に戻せない。
3. 代表者が利用枠・費用・リージョン・権限を確認した後、Azure Portal/Cloud ShellでContainer Appsを作り、URL上で主要操作を確認する。

- PR #2の`Tests`成功を確認: https://github.com/mrmo-sandbox/hackathon-for-student-20261017-3/actions/runs/38584733691/job/115923564240
- CodeQLは状態不明。Azure公開準備のDoDに含むテストではないため合格とは扱わず、PR上で確認継続。