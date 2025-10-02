import { getDb } from "@/lib/mongo";

type Row = { slug: string; title?: string };

// keep it dynamic so new posts show up without a rebuild
export const dynamic = "force-dynamic";

export default async function ArticlesIndex() {
  const { articles } = await getDb();

  const rows = (await articles
    .find({ status: "published" })
    .project({ _id: 0, slug: 1, title: 1 })
    .sort({ published_at: -1 })
    .limit(50)
    .toArray()) as Row[];

  return (
    <main className="prose mx-auto p-6">
      <h1>Latest Articles</h1>
      <ul>
        {rows.map((r) => (
          <li key={r.slug}>
            {/* IMPORTANT: use a string, NOT a bare /regex/ */}
            <a href={`/articles/${r.slug}`}>{r.title || r.slug}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}

