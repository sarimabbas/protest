import { getXataClient } from "@/xata";
import Link from "next/link";

export default async function Home() {
  const xata = getXataClient();
  const lists = await xata.db.lists.getMany();

  return (
    <main>
      <h1>Lists</h1>
      <br />
      {lists.map((l) => {
        return (
          <Link
            className="p-4 rounded-md bg-amber-200"
            key={l.id}
            href={`/lists/${l.id}`}
          >
            {l.name}
          </Link>
        );
      })}
    </main>
  );
}
