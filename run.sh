#!/bin/sh
# allow-read は読み取り許可
# allow-write は書き込み許可
# allow-net はネットワークの許可
deno run --allow-read --allow-write --allow-net --allow-env server.js
