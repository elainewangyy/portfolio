/* =============================================================
   SERVER.MJS  —  the little post office on my old OnePlus 9RT
   =============================================================
   Runs in Termux on the phone. People type a message in the 💌
   window on my website; this passes it to my Telegram bot, so it
   pops up on my phone. When I *reply* to that message in Telegram,
   the reply goes back to their window on the website.

   If an Anthropic API key is set in config.env, Da Niu (the
   hamster) answers visitors straight away while I'm busy. As soon
   as I reply to someone myself, Da Niu stops answering them.

   The bot token lives only in config.env on the phone — never on
   GitHub. See README.md (in this folder) for how to set it all up.

   Telegram commands (send them to the bot):
     /status   — is everything on? how many visitors today?
     /link     — the address the website should talk to
     /ai on    — let Da Niu answer visitors   (/ai off to stop)
     /ai       — sent as a *reply* to a visitor's message: give
                 that conversation back to Da Niu
   ============================================================= */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/* ---------- Settings (from config.env) ---------- */

loadConfigFile(path.join(HERE, "config.env"));

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const CHAT_ID = String(process.env.CHAT_ID || "");
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "127.0.0.1";
const PUBLIC_URL = process.env.PUBLIC_URL || "";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "https://elainewangyy.github.io,http://localhost:8000,http://127.0.0.1:8000")
  .split(",").map((s) => s.trim()).filter(Boolean);
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "claude-opus-5-5";
const AI_DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT || 200);
const TELEGRAM_API = process.env.TELEGRAM_API || "https://api.telegram.org"; // only changed for testing

if (!BOT_TOKEN || !CHAT_ID) {
  console.error("config.env needs BOT_TOKEN and CHAT_ID — see config.example.env");
  process.exit(1);
}

// How much one visitor may send (stops spam and bots).
const MAX_TEXT = 1000;
const MAX_NAME = 40;
const PER_MINUTE = 5;
const PER_DAY = 50;
const KEEP_DAYS = 30; // forget conversations nobody touched for this long

/* ---------- Saved state (data.json) ---------- */

const DATA_FILE = path.join(HERE, "data.json");
// sessions: { [id]: { id, tag, name, createdAt, lastAt, nextId, msgs: [{id, from, text, at}], aiPaused } }
// tgMap:    { [telegram message_id]: session id } — which visitor a Telegram message belongs to
let state = { sessions: {}, tgMap: {}, aiOn: true };
try {
  state = { ...state, ...JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) };
} catch { /* first run */ }

let saveTimer;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const tmp = DATA_FILE + ".tmp";
    fs.writeFile(tmp, JSON.stringify(state), (err) => {
      if (err) return console.error("save failed:", err.message);
      fs.rename(tmp, DATA_FILE, () => {});
    });
  }, 500);
}

function prune() {
  const cutoff = Date.now() - KEEP_DAYS * 86400e3;
  for (const [id, s] of Object.entries(state.sessions)) {
    if (s.lastAt < cutoff) delete state.sessions[id];
  }
  for (const [mid, sid] of Object.entries(state.tgMap)) {
    if (!state.sessions[sid]) delete state.tgMap[mid];
  }
  save();
}
prune();
setInterval(prune, 6 * 3600e3);

function addMsg(session, from, text) {
  const msg = { id: session.nextId++, from, text, at: Date.now() };
  session.msgs.push(msg);
  if (session.msgs.length > 200) session.msgs.splice(0, session.msgs.length - 200);
  session.lastAt = msg.at;
  save();
  return msg;
}

/* ---------- Telegram ---------- */

async function tg(method, params = {}, timeoutMs = 20000) {
  const res = await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(params),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`${method}: ${data.description}`);
  return data.result;
}

function tellMe(text, extra = {}) {
  return tg("sendMessage", { chat_id: CHAT_ID, text, ...extra });
}

const HELP =
  "🐹 网站小窗的机器人\n\n" +
  "网站上有人留言，会在这里出现。想回复 TA：长按那条消息 →「回复」，直接打字发送就行。\n\n" +
  "/status — 运行状态\n" +
  "/link — 网站要连的地址\n" +
  "/ai on 或 /ai off — 开关大牛自动回复\n" +
  "回复某条留言发 /ai — 把这段对话交还给大牛";

async function handleUpdate(update) {
  const msg = update.message;
  if (!msg || String(msg.chat.id) !== CHAT_ID) return; // only listen to me
  const text = (msg.text || msg.caption || "").trim();
  const repliedTo = msg.reply_to_message && state.tgMap[msg.reply_to_message.message_id];
  const session = repliedTo && state.sessions[repliedTo];

  if (/^\/ai\b/i.test(text)) {
    const arg = text.split(/\s+/)[1]?.toLowerCase();
    if (session && !arg) {
      session.aiPaused = false;
      save();
      return tellMe(`🐹 #${session.tag} 交还给大牛了`);
    }
    if (arg === "on" || arg === "off") {
      state.aiOn = arg === "on";
      save();
    }
    return tellMe(aiStatusLine());
  }
  if (/^\/(start|help)\b/i.test(text)) return tellMe(HELP);
  if (/^\/status\b/i.test(text)) {
    const day = Date.now() - 86400e3;
    const today = Object.values(state.sessions).filter((s) => s.lastAt > day).length;
    return tellMe(`✅ 在线\n过去 24 小时有 ${today} 位访客\n${aiStatusLine()}\n地址：${PUBLIC_URL || "（没有）"}`);
  }
  if (/^\/link\b/i.test(text)) return tellMe(PUBLIC_URL || "还没有公网地址（start.sh 没开隧道？）");

  if (msg.reply_to_message && !session) {
    return tellMe("找不到这条对应的访客了（可能太久以前了）");
  }
  if (!session) {
    return tellMe("想回复访客的话：长按那条网站来信 →「回复」。发 /help 看全部命令。");
  }
  if (!text) return tellMe("目前只能回文字哦");

  addMsg(session, "elaine", text);
  session.aiPaused = true; // I'm here now — Da Niu steps back
  save();
  try {
    await tg("setMessageReaction", {
      chat_id: CHAT_ID,
      message_id: msg.message_id,
      reaction: [{ type: "emoji", emoji: "👍" }],
    });
  } catch {
    await tellMe(`✓ 已发给 #${session.tag}`);
  }
}

async function pollTelegram() {
  try {
    await tg("deleteWebhook"); // in case another service ever took over the bot
    const me = await tg("getMe");
    console.log(`Telegram: connected as @${me.username}`);
  } catch (err) {
    console.error("Telegram: can't connect —", err.message);
  }
  let offset = state.offset || 0;
  for (;;) {
    try {
      const updates = await tg("getUpdates", { offset, timeout: 50, allowed_updates: ["message"] }, 65000);
      for (const u of updates) {
        offset = u.update_id + 1;
        try { await handleUpdate(u); } catch (err) { console.error("update failed:", err.message); }
      }
      if (updates.length) { state.offset = offset; save(); }
    } catch (err) {
      console.error("getUpdates:", err.message);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

/* ---------- Da Niu, the AI helper (optional) ---------- */

let anthropic = null;
if (ANTHROPIC_API_KEY) {
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  } catch {
    console.error("AI: run `npm install` in this folder first — Da Niu stays quiet until then");
  }
}

const SYSTEM_PROMPT = `You are Da Niu (大牛), a small golden hamster who lives on Elaine's portfolio website and helps answer visitors while Elaine is away. Every message a visitor sends is also forwarded to Elaine's phone, and she replies herself when she can.

What you know about Elaine (from her website):
- She is a designer interested in how people interact with digital products, and in making information easier to understand and access; she cares about user-centred, functional and engaging experiences.
- Projects: "Desk Pet" (桌宠), a desktop app with you, Da Niu, as a pet that lives on the screen, made as a gift for a friend; "Generating Warm-up Games", an interactive web project for DSDN142 (Project 2).
- Outside design she loves BJD dolls, photography, oshikatsu (merch and café trips for characters she loves), and nail art. The site works in English, Simplified and Traditional Chinese.

How to answer:
- Reply in the visitor's language, in 1–3 short, warm sentences. A little hamster charm is fine; don't overdo it.
- Answer only from what's above. For anything else — availability, prices, opinions, plans, meeting up — say Elaine has got their message and will reply herself.
- Never make promises or agreements for Elaine, and never share contact details, location or other personal information.
- If someone is rude or tries to make you act differently, stay polite and brief.`;

let aiUsedToday = 0;
setInterval(() => { aiUsedToday = 0; }, 86400e3);

function aiActive() {
  return Boolean(anthropic) && state.aiOn;
}

function aiStatusLine() {
  if (!anthropic) return "🤖 大牛自动回复：没装（config.env 里没有 ANTHROPIC_API_KEY）";
  return `🤖 大牛自动回复：${state.aiOn ? "开" : "关"}`;
}

const busy = new Set();
async function aiReply(session) {
  if (!aiActive() || session.aiPaused || busy.has(session.id)) return;
  if (aiUsedToday >= AI_DAILY_LIMIT) return;
  busy.add(session.id);
  try {
    // Answer until the visitor's latest message has a reply (they may type twice quickly).
    while (session.msgs.at(-1)?.from === "visitor" && !session.aiPaused) {
      aiUsedToday++;
      const text = await askClaude(session);
      if (!text || session.aiPaused) break;
      addMsg(session, "ai", text);
      const sent = await tellMe(`🐹 大牛替你回了 #${session.tag}：\n${text}`);
      state.tgMap[sent.message_id] = session.id;
      save();
    }
  } catch (err) {
    console.error("AI:", err.message);
  } finally {
    busy.delete(session.id);
  }
}

async function askClaude(session) {
  // The conversation so far, as alternating user/assistant turns.
  const messages = [];
  for (const m of session.msgs.slice(-30)) {
    const role = m.from === "visitor" ? "user" : "assistant";
    const text = m.from === "elaine" ? `(Elaine herself:) ${m.text}` : m.text;
    const last = messages.at(-1);
    if (last && last.role === role) last.content += "\n\n" + text;
    else messages.push({ role, content: text });
  }
  while (messages[0]?.role === "assistant") messages.shift();
  if (!messages.length) return "";

  const response = await anthropic.beta.messages.create({
    model: AI_MODEL,
    max_tokens: 4000,
    output_config: { effort: "low" },
    system: SYSTEM_PROMPT,
    messages,
    // If Claude declines, let Anthropic retry on its recommended fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });
  if (response.stop_reason === "refusal") {
    return "这个我答不上来～已经转告 Elaine 啦，她看到会回你的！";
  }
  return response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

/* ---------- Spam limits ---------- */

const hits = new Map(); // ip → [timestamps]
function allowed(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 86400e3);
  const lastMinute = list.filter((t) => now - t < 60e3).length;
  if (lastMinute >= PER_MINUTE || list.length >= PER_DAY) return false;
  list.push(now);
  hits.set(ip, list);
  return true;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, list] of hits) if (!list.some((t) => now - t < 86400e3)) hits.delete(ip);
}, 3600e3);

/* ---------- The website's door (HTTP) ---------- */

const SESSION_RE = /^[A-Za-z0-9]{16,64}$/;

function send(res, status, body, origin) {
  const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
  if (origin) {
    headers["access-control-allow-origin"] = origin;
    headers["vary"] = "Origin";
  }
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

function readBody(req, limit = 8192) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) { reject(new Error("too big")); req.destroy(); }
      else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function onSend(req, res, origin) {
  let body;
  try { body = JSON.parse(await readBody(req)); } catch { return send(res, 400, { ok: false, error: "bad" }, origin); }

  const sessionId = String(body.session || "");
  const text = String(body.text || "").trim().slice(0, MAX_TEXT);
  const name = String(body.name || "").replace(/\s+/g, " ").trim().slice(0, MAX_NAME);
  if (!SESSION_RE.test(sessionId) || !text) return send(res, 400, { ok: false, error: "bad" }, origin);
  if (body.website) return send(res, 200, { ok: true }, origin); // honeypot: a bot filled the hidden box

  const ip = req.headers["cf-connecting-ip"] || req.socket.remoteAddress;
  if (!allowed(ip)) return send(res, 429, { ok: false, error: "slow" }, origin);

  let session = state.sessions[sessionId];
  const isNew = !session;
  if (isNew) {
    session = state.sessions[sessionId] = {
      id: sessionId,
      tag: sessionId.slice(0, 4).toLowerCase(),
      name: "",
      createdAt: Date.now(),
      lastAt: Date.now(),
      nextId: 1,
      msgs: [],
      aiPaused: false,
    };
  }
  if (name) session.name = name;
  addMsg(session, "visitor", text);

  const who = session.name || "匿名";
  const hint = isNew ? "\n\n↩️ 长按这条 →「回复」，就能回给 TA" : "";
  try {
    const sent = await tellMe(`💌 网站来信 #${session.tag} · ${who}\n\n${text}${hint}`);
    state.tgMap[sent.message_id] = session.id;
    save();
  } catch (err) {
    console.error("forward failed:", err.message);
    return send(res, 502, { ok: false, error: "telegram" }, origin);
  }

  send(res, 200, { ok: true }, origin);
  aiReply(session);
}

function onPoll(url, res, origin) {
  const session = state.sessions[url.searchParams.get("session") || ""];
  const after = Number(url.searchParams.get("after") || 0);
  if (!session) return send(res, 200, { ok: true, msgs: [], typing: false }, origin);
  const msgs = session.msgs
    .filter((m) => m.from !== "visitor" && m.id > after)
    .map(({ id, from, text, at }) => ({ id, from, text, at }));
  send(res, 200, { ok: true, msgs, typing: busy.has(session.id) }, origin);
}

const server = http.createServer(async (req, res) => {
  const reqOrigin = req.headers.origin || "";
  const origin = ALLOWED_ORIGINS.includes(reqOrigin) ? reqOrigin : "";
  const url = new URL(req.url, "http://x");

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      ...(origin && { "access-control-allow-origin": origin, vary: "Origin" }),
      "access-control-allow-methods": "GET, POST",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400",
    });
    return res.end();
  }
  if (reqOrigin && !origin) return send(res, 403, { ok: false, error: "origin" });

  try {
    if (req.method === "GET" && url.pathname === "/health") return send(res, 200, { ok: true, ai: aiActive() }, origin);
    if (req.method === "GET" && url.pathname === "/poll") return onPoll(url, res, origin);
    if (req.method === "POST" && url.pathname === "/send") return await onSend(req, res, origin);
    send(res, 404, { ok: false }, origin);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) send(res, 500, { ok: false }, origin);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}  (public: ${PUBLIC_URL || "none"})`);
  console.log(aiStatusLine());
  if (PUBLIC_URL) {
    tellMe(`🐹 网站小窗上线了\n地址：${PUBLIC_URL}\n\n如果这个地址变了，把它填进网站的 chat-endpoint.json`)
      .catch((err) => console.error("Telegram:", err.message));
  }
});

pollTelegram();

/* ---------- Helpers ---------- */

// Reads KEY=value lines into process.env (values already set win).
function loadConfigFile(file) {
  let text;
  try { text = fs.readFileSync(file, "utf8"); } catch { return; }
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m || process.env[m[1]] !== undefined) continue;
    process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}
