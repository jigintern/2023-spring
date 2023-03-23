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
    const resp = await fetchChat(requestJson);
    return new Response(resp)
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
