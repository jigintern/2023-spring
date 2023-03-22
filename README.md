# 2023-spring

main ブランチに PUSH されたら自動で Deno Deploy にデプロイされます。

https://jigintern-2023-spring.deno.dev/

## Deno の起動方法

`deno run server.js` と記入すれば起動できますが、deno は実行時に権限を付与する必要があります。

run.sh というファイルの `--allow-net` 等と書かれたコマンドを実行することで実行できます。\
ということで下記のどちらかを実行しましょう。

`./run.sh` 実行時に `Permission Denied` のような権限エラーが出たら、初回だけ `chmod 711 run.sh`
を実行すると治るはずです。

```
./run.sh
```

```
deno run --allow-read --allow-write --allow-net server.js
```
