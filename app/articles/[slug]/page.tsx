import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/mongo";

// Shape we read from Mongo
type Doc = {
  slug: string;
  title?: string;
  description?: string;       // optional short summary
  content_html?: string;
  status?: string;
  published_at?: number | Date;
};

// --------- SEO per-article ----------
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;               // ✅ avoids the Next “await params” warning
  const { articles } = await getDb();
  const doc = (await articles.findOne({ slug })) as Doc | null;

  if (!doc || doc.status !== "published") {
    return { title: "Not found" };
  }

  const title = doc.title || slug.replace(/[-_]+/g, " ");
  const description =
    doc.description ||
    "Read the latest from Best No-Code App—guides, updates and experiments.";

  return {
    title,
    description,
    alternates: {
      // metadataBase is set in layout.tsx, so relative canonical works
      canonical: `/articles/${slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/articles/${slug}`,
      siteName: "Best No-Code App",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

// --------- Page UI ----------
export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;               // ✅ same fix here
  const { articles } = await getDb();

  const doc = (await articles.findOne({ slug })) as Doc | null;
  if (!doc || doc.status !== "published") {
    notFound();
  }

  return (
    <main className="prose mx-auto p-6">
      <p>
        <Link href="/articles">← Back to Articles</Link>
      </p>
      <h1>{doc.title || slug}</h1>
      {/* If you also store content_md, you could render that too, but we’re using HTML here */}
      <article dangerouslySetInnerHTML={{ __html: doc.content_html || "" }} />
    </main>
  );
}