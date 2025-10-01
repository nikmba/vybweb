// scripts/auto-publish.mjs
import fs from "fs";
import path from "path";
import { marked } from "marked";

// Load .env.sidecar (simple parser)
const envFile = path.resolve(".env.sidecar");
const env = Object.fromEntries(
  fs
    .readFileSync(envFile, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const BASE = env.SIDECAR_BASE;        // e.g. https://sidecar-dropin-yyovvouk.replit.app
const TOKEN = env.SIDECAR_TOKEN;      // e.g. Bearer <token>
const DEFAULT_FARM = env.DEFAULT_FARM || "F1";

if (!BASE || !TOKEN) {
  console.error("Missing SIDECAR_BASE or SIDECAR_TOKEN in .env.sidecar");
  process.exit(1);
}

// Queue file
const queuePath = process.argv[2] || path.resolve("content", "queue.json");
const raw = fs.readFileSync(queuePath, "utf8");
const items = JSON.parse(raw);

function mdToHtml(md) {
  return md ? marked.parse(md) : "";
}

async function call(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} -> ${t}`);
  }
  return res.json();
}

async function run() {
  console.log(`Queue: ${items.length} article(s)`);
  for (const item of items) {
    const farm_id = item.farm_id || DEFAULT_FARM;
    const slug = item.slug;
    const title = item.title || slug;
    const content_html = item.content_html || mdToHtml(item.content_md || "");
    const payload = {
      farm_id,
      slug,
      title,
      content_html,
      status: "draft",
    };

    try {
      const created = await call(`${BASE}/functions/createTestArticle`, payload);
      console.log(
        "CREATE/UPDATE:",
        slug,
        "->",
        created?.article?.status ?? created?.message ?? "ok"
      );

      const pub = await call(`${BASE}/functions/publishArticle`, { slug });
      console.log("PUBLISH:", slug, "->", pub?.published ? "published" : "NOT PUBLISHED");
    } catch (err) {
      console.error("ERROR for", slug, "=>", err.message);
    }
  }
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});