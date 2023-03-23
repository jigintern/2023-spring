// deno-lint-ignore-file
import {fetchChat} from "https://code4fukui.github.io/ai_chat/fetchChat.js";
import {config} from "https://deno.land/std@0.167.0/dotenv/mod.ts";
import {serveDir} from "https://deno.land/std@0.180.0/http/file_server.ts";
import {serve} from "https://deno.land/std@0.180.0/http/server.ts";
import {v4 as uuidv4} from "https://deno.land/std@0.180.0/uuid/mod.ts";

const posts = [];

serve(async (req) => {
    console.log(await config());

    const pathname = new URL(req.url).pathname;
    console.log(pathname);

    if (req.method === "GET" && pathname === "/welcome-message") {
        return new Response("ようこそ");
    }

    //POST /translate-ai
    //紹介文を概要とキーワードを元にAIで生成する
    if (req.method === "POST" && pathname === "/translate-ai") {
        const requestJson = await req.json();
        const overview = requestJson.overview;
        const keyword = requestJson.keyword;
        let resp = null;
        try {
            resp = await fetchChat(
                `${keyword}というキーワードがあてはまる人を集めた${overview}を開こうとしています。
        この${overview}の紹介文を200字程度で教えてください。ただし、キーワードの説明を中心に、その他の説明はできるだけ省くようにしてください。`
            );
        } catch (error) {
            console.error("Error while processing chat request:", error);
            return new Response("Error: " + error.message, {status: 500});
        }
        if (resp !== null) {
            return new Response(resp);
        }
    }

    //GET /get-posts
    //投稿を全件取得
    if (req.method === "GET" && pathname === "/get-posts") {
        // そうじゃない場合は全件返す
        return new Response(posts);
    }

    //POST /register-post
    //投稿を登録
    if (req.method === "POST" && pathname === "/register-post") {
        // リクエストボディを取得する
        const requestJson = await req.json();
        //ランダムなIDを生成する
        const id = uuidv4();
        const title = requestJson.title;
        const data = requestJson.data;
        const name = requestJson.name;
        const description = requestJson.discrption;
        //デフォルトは0
        const participants = 0;
        // リクエストボディをpostsに追加する
        posts.push({id, title, data, name, description, participants});
        // 更新されたpostsを返す
        return new Response(posts);
    }

    //POST /add-participants
    //参加者を1増やす
    if (req.method === "POST" && pathname === "/add-participants") {
        const u = new URL(req.url);
        const id = u.searchParams.get("id");
        //postsの中からidが一致するものを探す
        const post = posts.find((post) => post.id === id);
        //postの持つparticipantsを1増やす
        post.participants += 1;
        //更新されたpostsを返す
        return new Response(posts);
    }

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    });
});
