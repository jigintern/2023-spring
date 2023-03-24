# 2023-spring

main ブランチに PUSH されたら自動で Deno Deploy にデプロイされます。

https://jigintern-2023-spring.deno.dev/

## Deno の起動方法

`deno run server.js` と記入すれば起動できますが、deno
は実行時に権限を付与する必要があります。

run.sh というファイルの `--allow-net`
等と書かれたコマンドを実行することで実行できます。\
ということで下記のどちらかを実行しましょう。

`./run.sh` 実行時に `Permission Denied` のような権限エラーが出たら、初回だけ
`chmod 711 run.sh` を実行すると治るはずです。

```
./run.sh
```

```
deno run --allow-read --allow-write --allow-net server.js
```

## API構成

### POST: /tarnslate-ai

クライアントから受け取った概要とキーワードからAIに紹介文を作成してもらって、クライアントに返す。\
JSONでoverviewとkeywordを送ってもらう。

```json
{ "overview": "みんなで飲み会", "keyword": "サッカー部、飲み会、新歓" }
```

### POST: /register-post

クライアントから受け取った投稿を配列に登録する。\

```json
{ "title": "タイトル", "overview": "概要", "data": "日付", "name": "名前" , "description": "詳細"}
```

### POST: /add-participants

クライアントからidを受け取って、そのidの投稿の参加者を増やす。

```json
{ "id": 1 }
```

### GET: /get-posts

投稿を全件取得してクライアントに返す。
