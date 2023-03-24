// deno-lint-ignore-file
import { fetchChat } from "https://code4fukui.github.io/ai_chat/fetchChat.js";
import { config as dotenvConfig } from "https://deno.land/std@0.167.0/dotenv/mod.ts";
import {createClient} from "https://esm.sh/@supabase/supabase-js";
import {serve} from "https://deno.land/std@0.138.0/http/server.ts";
import {serveDir} from "https://deno.land/std@0.138.0/http/file_server.ts";
import "https://deno.land/std@0.167.0/dotenv/load.ts";

const url = Deno.env.get("SUPABASE_URL");
const key = Deno.env.get("SUPABASE_KEY");

const supabase = createClient(url, key)

//ポストを全件取得
async function fetchPosts() {
    const {data, error} = await supabase.from('post').select('*');//テーブル名 *は全てのカラム
    return {data, error};
}
//ポストを登録
async function registerPost(postData) {
    const {error} = await supabase.from('post').insert(postData);//テーブル名
    return {error};
}
//参加者数を取得
async function getParticipants(id) {
    const {data: participants, error} = await supabase
        .from('post')//テーブル名
        .select('participants')//取得するカラム
        .eq('id', id);//idが一致するもの
    return {participants, error};
}
//参加者数を更新
async function updateParticipants(id, newCount) {
    const {error} = await supabase
        .from('post')//テーブル名
        .update({participants: newCount})//更新するカラム
        .eq('id', id);//idが一致するもの
    return {error};
}
//エラー処理
async function handleError(error) {
    console.log("このエラーは" + error);
    return new Response(JSON.stringify({error: "An error occurred while processing your request"}), {
        status: 500,
        headers: {"content-type": "application/json"}
    });
}

serve(async (req) => {
    console.log(await dotenvConfig());


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
        console.log("overview:" + overview);
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
        const {data, error} = await fetchPosts();
        if (error) return handleError(error);

        console.log("成功したかも" + JSON.stringify(data));
        return new Response(JSON.stringify(data), {headers: {"content-type": "application/json"}});
    }

    //POST /register-post
    //投稿を登録
    if (req.method === "POST" && pathname === "/register-post") {
        const requestData = await req.json();
        const postData = {
            username: requestData.username,
            title: requestData.title,
            date: requestData.date,
            description: requestData.description,
            participants: 0
        };

        const {error} = await registerPost(postData);
        if (error) return handleError(error);

        console.log("成功したかも" + requestData.date);
        return new Response(JSON.stringify(requestData), {headers: {"content-type": "application/json"}});
    }

    //POST /add-participants
    //参加者を1増やす
    if (req.method === "POST" && pathname === "/add-participants") {
        const requestData = await req.json();

        const {participants, error1} = await getParticipants(requestData);
        if (error1) return handleError(error1);

        const newParticipantCount = participants[0].participants + 1;
        const {error} = await updateParticipants(requestData, newParticipantCount);
        if (error) return handleError(error);

        console.log("成功したかも" + requestData);
        return new Response(JSON.stringify(requestData), {headers: {"content-type": "application/json"}});
    }

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    });
});
