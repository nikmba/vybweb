import { getDb } from "@/lib/mongo";
import { mdToHtml } from "@/lib/md";
import type { Metadata } from "next";

type Doc = {
  slug: string;
  title?: string;
  status?: string;
  content_html?: string;
  body?: string;
  content?: string;
  content_md?: string;
  description?: string;
};

function ctaHtml(slug: string) {
  return `
  <hr />
  <section style="margin-top:24px">
    <p>👉 Explore more on <a href="https://VYBWeb.com" target="_blank" rel="nofollow">VYBWeb.com</a></p>
    <p>🚀 Build & ship apps on <a href="https://AppVYB.com" target="_blank" rel="nofollow">AppVYB.com</a></p>
    <p>💡 Start vibecoding → <a href="/try" rel="nofollow">Try free now</a></p>
  </section>`;
}

// Next 15+ wants params awaited for dynamic routes
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { articles } = await getDb();

  const doc = (await articles.findOne({ slug })) as Doc | null;
  if (!doc || doc.status !== "published") return { title: "Not found" };

  return {
    title: doc.title || doc.slug,
    description: doc.description || undefined,
    alternates: { canonical: `/articles/${doc.slug}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { articles } = await getDb();

  const doc = (await articles.findOne({ slug })) as Doc | null;
  if (!doc || doc.status !== "published") {
    return (
      <main className="prose mx-auto p-6">
        <h1>Not found</h1>
      </main>
    );
  }

  const html =
    doc.content_html || doc.body || doc.content || mdToHtml(doc.content_md || "");

  return (
    <main className="prose mx-auto p-6">
      <h1>{doc.title || doc.slug}</h1>
      {/* eslint-disable-next-line react/no-danger */}
      <article dangerouslySetInnerHTML={{ __html: html + ctaHtml(doc.slug) }} />
    </main>
  );
}
