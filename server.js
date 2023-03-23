// deno-lint-ignore-file
import { serveDir } from "https://deno.land/std@0.180.0/http/file_server.ts";
import { serve } from "https://deno.land/std@0.180.0/http/server.ts";

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if (req.method === "GET" && pathname === "/welcome-message") {
    return new Response("jigインターン初コミット！！");
  }

  // GET
  // クライアント側で単純にデータベースなどに入っている情報を取得したいときに使う
  if (req.method === "GET" && pathname === "/test-get") {
    return new Response("test");
  }

  // GETでもデータを受け取ることはできる
  if (req.method === "GET" && pathname === "/test-get-json") {
    const u = new URL(req.url);
    const params = u.searchParams;
    const testWord = params.get("testword");
    if (!testWord) {
      return new Response("testWordを指定してください");
    }
    return new Response(`${testWord}を受け取りました`);
  }

  // POST
  // クライアント側のフォームの入力情報等を受け取って保存したりするとかはこっち
  // 例では、クライアント側から Json で testWord という String 型のデータを受け取ってる想定です
  if (req.method === "POST" && pathname === "/test-post") {
    const requestJson = await req.json();
    const testWord = requestJson.testWord;
    console.log(testWord);
    if (!testWord) {
      return new Response("testWordを指定してください");
    }
    return new Response(`${testWord}を受け取りました`);
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
