// deno-lint-ignore-file
import { config } from "https://deno.land/std@0.167.0/dotenv/mod.ts";
import { serveDir } from "https://deno.land/std@0.180.0/http/file_server.ts";
import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { fetchChat } from "./fetchChat.js";

serve(async (req) => {
  console.log(await config());

  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if (req.method === "GET" && pathname === "/welcome-message") {
    return new Response(resp);
  }

  if (req.method === "POST" && pathname === "/translate-ai") {
    const requestJson = await req.json();
    const requestObject = requestJson.object;
    const requestKeyWords = requestJson.keywords;
    let resp = null;
    try {
      resp = await fetchChat(
        `${requestKeyWords}というキーワードがあてはまる人を集めた${requestObject}を開こうとしています。
        この${requestObject}の紹介文を200字程度で教えてください。ただし、キーワードの説明を中心に、その他の説明はできるだけ省くようにしてください。`
      );

    } catch (error) {
      console.error("Error while processing chat request:", error);
      return new Response("Error: " + error.message, { status: 500 });
    }
    if (resp !== null) {
      return new Response(resp);
      ("");
    }
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
