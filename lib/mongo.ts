import { MongoClient, Db, Collection } from "mongodb";

let client: MongoClient | null = null;
let _db: Db | null = null;
let _articles: Collection | null = null;

export async function getDb() {
  const uri = process.env.MONGO_URI!;
  const dbName = process.env.MONGO_DB || "base44";
  if (!uri) throw new Error("MONGO_URI missing");
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    _db = client.db(dbName);
    _articles = _db.collection("articles");
    await _articles.createIndex({ slug: 1 }, { unique: true });
  }
  return { db: _db!, articles: _articles! };
}
