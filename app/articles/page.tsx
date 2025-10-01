import { getDb } from "@/lib/mongo";

type Row = { slug: string; title?: string };

export default async function ArticlesIndex() {
  const { articles } = await getDb();
  const rows = (await articles
    .find({ status: "published" })
    .project({ slug: 1, title: 1, _id: 0 })
    .sort({ published_at: -1 })
    .limit(50)
    .toArray()) as Row[];

  return (
    <main className="prose mx-auto p-6">
      <h1>Latest Articles</h1>
      <ul>
        {rows.map((r) => (
          <li key={r.slug}>
            <a href={"/articles/" + r.slug}>{r.title || r.slug}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
