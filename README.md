# iSlide v0.1.1

Marp Markdown をブラウザ上で編集・プレビューし、`.md` / HTML として持ち出すための静的HTMLツールです。

生成AIなどで作成した Marp Markdown を貼り付けるだけで、その場でスライドとして確認・修正できます。
保存されるデータは **Marp Markdown そのもの** で、独自形式への変換は行いません。

```
貼る → その場で見る → 修正する → .md として持ち出す
```

## 特長

- **iSlide自身は外部通信を必要としません。** 起動後、iSlideが自ら外部API・CDN・Webフォントへアクセスすることはありません。社内ネットワークやオフライン端末でもそのまま使えます（詳細は「[外部通信について](#外部通信について)」）。
- **スライド生成は [@marp-team/marp-core](https://github.com/marp-team/marp-core) を使用します。** Marp CLI / Marp for VS Code と同じレンダリングエンジンです。
- **ビルド環境は不要です。** 必要なJavaScriptを同梱しているため、利用端末に Node.js / npm は要りません。

## 起動方法

### そのまま開く

`iSlide.html` をブラウザ（Chrome / Edge など）で開きます。ファイルをダブルクリックする `file://` での起動でも動作します。

### Webサーバへ配置する

IIS などの静的Webサーバへ、以下をディレクトリ構成のまま配置します。

```
iSlide.html
assets/marp-core.bundle.js
```

`https://<server>/<path>/iSlide.html` を開けば利用できます。サーバ側の特別な設定は不要です。

## 画面構成

```
┌──────────────────────────────────────────────┐
│ iSlide                                       │
│ [新規] [開く] [Markdown保存] [HTML出力]      │
│ テーマ[default ▼]        [印刷] [プレゼン表示]│
├──────────────────────┬───────────────────────┤
│ Markdown             │ Preview               │
│                      │                       │
└──────────────────────┴───────────────────────┘
```

左のMarkdownを編集すると、右のプレビューが自動で更新されます（入力が止まってから約0.3秒後）。
中央の境界をドラッグすると左右の幅を変更できます。

## Marp Markdown の基本

先頭のYAML front matterでスライド全体の設定を行い、`---` の行でスライドを区切ります。

```markdown
---
marp: true
theme: default
paginate: true
---

# 1枚目のタイトル

本文を書きます。

---

## 2枚目

- 箇条書き
- **強調** や `コード`

| 列A | 列B |
| --- | --- |
| 1   | 2   |

---

<!-- _paginate: false -->

## 3枚目（このページだけページ番号なし）

![w:400](images/photo.png)
```

[Marp の記法](https://marpit.marp.app/markdown)をそのまま利用できます。スライド区切り、front matter、
Marp directives（`<!-- _class: lead -->` などのスコープ付きを含む）、テーブル、画像のサイズ指定（`![w:400]`）、
コードブロック、`# <!-- fit -->` による見出しの自動縮小、数式（MathJax）などが利用できます。

### テーマ

`default` / `gaia` / `uncover` の3つの標準テーマを利用できます。

適用されるテーマは **常に front matter の `theme`** です。ツールバーのテーマ選択を変更すると、その値が front matter の `theme:` 行へ書き込まれます（front matter が無い場合は新しく追加されます）。
そのため、テーマを切り替えても Markdown は Marp 互換のまま保たれ、他のツールで開いても同じテーマで表示されます。

## `.md` の読み込みと保存

### 読み込み

「開く」ボタンからローカルの `.md` ファイルを選択します。内容は変換せず、そのまま Marp Markdown としてエディタへ読み込みます。

> **相対パスの画像について**：`![](images/photo.jpg)` のような相対パスの画像は、読み込んだ `.md` ファイルの場所ではなく `iSlide.html` の場所を基準に解決されます。これはブラウザが `.md` の元の場所を扱えないための制約です。相対パスの画像を確認したい場合は、画像を `iSlide.html` から見た相対位置に置くか、絶対URL / data URI を使ってください。

### 保存

「Markdown保存」ボタンで、編集中のMarkdownを `.md` としてダウンロードします。
保存した `.md` は iSlide のほか、[Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode) や [Marp CLI](https://github.com/marp-team/marp-cli) でそのまま再利用できます。

ファイル名は、読み込んだファイル名 → 最初の `# 見出し` → `slides` の順で決まります。

### 編集内容の一時保存

編集中のMarkdownはブラウザの localStorage へ自動保存され、次回起動時に復元されます。誤ってブラウザを閉じても編集内容は残ります。

> **読み込んだ `.md` ファイル自体が書き換えられることはありません。** ファイルとして残すには「Markdown保存」を実行してください。

## HTML出力 / PDF出力

### HTML出力

「HTML出力」ボタンで、現在のスライドを1つのHTMLファイルとしてダウンロードします。
スライドのHTMLとCSSを内包しているため、そのファイル単体をブラウザで開くだけでスライドを閲覧できます（外部通信も発生しません）。配布や共有に利用できます。

### PDF出力（印刷）

「印刷」ボタンを押すと、印刷用に整形したスライドが新しいタブで開き、ブラウザの印刷ダイアログが表示されます。
送信先に **「PDFに保存」** を選ぶとPDFとして保存できます。

用紙サイズはスライドサイズ（既定では 1280×720px）に合わせて指定済みです。印刷設定では次を確認してください。

- 余白：なし
- 背景のグラフィック：オン

## プレゼン表示

「プレゼン表示」ボタンで編集UIを隠し、スライドを画面いっぱいに1枚ずつ表示します。

| 操作 | キー |
| --- | --- |
| 次のスライド | `→` `↓` `Space` `PageDown` `Enter` / クリック |
| 前のスライド | `←` `↑` `Shift+Space` `PageUp` `Backspace` |
| 最初 / 最後 | `Home` / `End` |
| 編集画面へ戻る | `Esc` |

## 外部通信について

iSlide 自身は、起動後に外部のAPI・CDNへ一切アクセスしません。Marp Core は同梱済みのバンドルから読み込みます。

これを保つため、Marp Core の既定動作のうち次の2点だけ設定を変えています。いずれも Markdown の記法や互換性には影響せず、見た目のフォントのみが変わります。

- **絵文字**：既定では絵文字を twemoji の画像（CDN）へ置き換えますが、これを無効にし、フォントの絵文字として表示します。
- **テーマのWebフォント**：`gaia` テーマは Web フォントを `@import` で読み込みますが、この `@import` を取り除き、テーマが指定するフォールバックフォントで表示します。

数式は外部リソースを必要としない MathJax で描画します。

### 注意：Markdown中に外部URLを書いた場合

上記はあくまで「iSlideが自発的に外部へアクセスしないこと」を保証するものです。編集中の Markdown に、

```markdown
![](https://example.com/photo.jpg)
```

のような外部URLの画像やリンクを記述した場合、その取得はブラウザが通常のWebページと同様に行うため、外部通信が発生します。オフライン環境や外部通信を禁止したい環境で確認する場合は、画像を data URI で埋め込むか、ローカル/相対パスの画像を使ってください。

## Marp Core の更新

`assets/marp-core.bundle.js` はリポジトリへ同梱しているため、Marp Core を更新したときはバンドルの再生成が必要です。
GitHub上だけで完結する以下のフローで行えます（ローカルにNode.js/npmは不要）。

```text
1. Dependabot が Marp Core（または esbuild）の更新PRを作成する
2. PR検証workflow（Verify Marp Core bundle）が実行される
   → package.json / package-lock.json は更新されたが bundle が古いままの場合は失敗する
3. Actions タブから「Update Marp Core bundle」workflowを開き、
   branch にDependabot PRのbranch名を指定して実行する
4. bundleに差分があれば、同じPRへ `build: regenerate Marp Core bundle` として
   自動でcommitが追加される（差分が無ければ何もコミットされない）
5. PRのActionsが再実行され、Verify workflowが成功することを確認する
6. 下記「更新後の確認項目」に沿ってiSlideの主要機能を手動確認する
7. 問題なければ人がレビューし、マージする
```

Dependabot PRの自動approve・自動mergeは行いません。Marp CoreはiSlideのレンダリングエンジンそのものであり、表示やHTML構造が変わりうるため、最終判断は必ず人が行います。

### ローカルで更新する

GitHub Actionsを使わず、ローカルでバンドルを再生成することもできます。

```bash
npm install
npm run build     # assets/marp-core.bundle.js を再生成
```

`package.json` の `@marp-team/marp-core` はバージョンを完全固定しています（例: `"4.4.0"`、範囲指定はしない）。同梱バンドルと依存関係の内容を常に一致させるためです。更新後は `package.json` と `package-lock.json` の両方が新しいバージョンで整合していることを確認してください。

### 更新後の確認項目

iSlideはMarp Core標準の出力へ追加処理（twemojiの無効化、`@import` の除去、iframe内での描画、Marp Coreが生成するscriptの再有効化）を行っており、Marp Core側の変更で壊れやすい箇所です。更新時は次を手動で確認してください。

- 基本Markdownレンダリング / `---` によるスライド分割 / front matter / `paginate` / directives
- テーマ: `default` / `gaia` / `uncover`
- テーブル / コードブロック / 画像 / 数式
- プレゼン表示 / HTML出力 / 印刷（PDF）
- ブラウザConsoleに致命的エラーが出ていないこと
- iSlide自身から予期しない外部通信が発生していないこと（開発者ツールのNetworkタブで確認）

## 構成

| パス | 役割 |
| --- | --- |
| `iSlide.html` | アプリ本体（UI・エディタ・プレビュー・入出力） |
| `assets/marp-core.bundle.js` | Marp Core のビルド済みバンドル（生成物） |
| `build/entry.js` | バンドルのエントリポイント |
| `build/build.mjs` | esbuild によるビルドスクリプト |
| `.github/dependabot.yml` | Marp Core / esbuild の更新PRを作成するDependabot設定 |
| `.github/workflows/verify-bundle.yml` | PR検証workflow（同梱バンドルが最新かを確認する） |
| `.github/workflows/update-bundle.yml` | 手動実行でバンドルを再生成し、指定branchへcommitするworkflow（権限の分離方針はファイル冒頭のコメントを参照） |

`iSlide.html` は、`<style>`（アプリUIのCSS）、HTML（ツールバーとレイアウト）、プレビュー用iframeのテンプレート、`<script>`（アプリ本体）の順に構成しています。
プレビューは iframe 内で描画し、親ページとは `postMessage` のみでやり取りします。これによりスライドのCSSがアプリUIへ影響せず、`file://` からの起動でも動作します。

## ライセンス

MIT
