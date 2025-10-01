import { getDb } from "@/lib/mongo";

type Doc = { slug: string; title?: string; status?: string };

export default async function ArticlesIndex() {
  const { articles } = await getDb();
  const docs = (await articles
    .find({ status: "published" })
    .project({ slug: 1, title: 1, _id: 0 })
    .sort({ published_at: -1 })
    .limit(50)
    .toArray()) as Doc[];

  return (
    <main className="prose mx-auto p-6">
      <h1>Latest Articles</h1>
      <ul>
        {docs.map((d) => (
          <li key={d.slug}>
            <a href={"/articles/" + d.slug}>{d.title || d.slug}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
