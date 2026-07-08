#!/usr/bin/env node
// Seed demo posts to Sanity via API
// Usage:
//   SANITY_WRITE_TOKEN=... pnpm seed
//   or create token at https://www.sanity.io/manage/project/xvb579py -> API -> Tokens -> Editor

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xvb579py";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error("\nMissing write token.\n");
  console.error("1. Go to https://www.sanity.io/manage/project/xvb579py");
  console.error("2. API -> Tokens -> Create New Token");
  console.error("   Name: seed-script, Permissions: Editor or Create");
  console.error("3. Run: SANITY_WRITE_TOKEN=<token> pnpm seed\n");
  console.error("Or skip this and seed manually via /studio:\n");
  console.error("  pnpm dev");
  console.error("  open http://localhost:3000/studio -> Create Post -> Publish\n");
  process.exit(1);
}

const posts = [
  {
    _id: "post-hello-from-sanity",
    _type: "post",
    title: "Hello from Sanity",
    slug: { _type: "slug", current: "hello-from-sanity" },
    excerpt: "Your headless CMS is live. This post came from Sanity's production dataset.",
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [{ _type: "span", _key: "s1", text: "Sanity is connected! You can edit this post in /studio, publish, and it will show up on your Next.js site with ISR (revalidates every 60s)." }],
      },
    ],
  },
  {
    _id: "post-how-it-works",
    _type: "post",
    title: "How this demo works",
    slug: { _type: "slug", current: "how-it-works" },
    excerpt: "Next.js fetches GROQ queries via next-sanity. Edit schema in sanity/schema.ts.",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    body: [
      {
        _type: "block",
        _key: "b2",
        style: "normal",
        children: [{ _type: "span", _key: "s2", text: "Stack: Next.js 16 (App Router) + Tailwind 4 + next-sanity 13 + Sanity dataset production.\n\n- schema defined in sanity/schema.ts\n- client in sanity/lib/client.ts (useCdn:true)\n- queries in sanity/lib/queries.ts (GROQ)\n- / = list view, /posts/[slug] = detail with PortableText\n- /studio = embedded Sanity Studio" }],
      },
    ],
  },
];

async function createOrReplace(doc) {
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error(`Failed ${doc.slug.current}:`, JSON.stringify(json, null, 2));
    throw new Error(json.error?.description || "mutate failed");
  }
  return json;
}

for (const post of posts) {
  console.log(`Seeding ${post.slug.current}...`);
  const r = await createOrReplace(post);
  console.log(`  ok: ${r.results?.[0]?.document?._id}`);
}

console.log("\nDone! Visit http://localhost:3000 to see live posts.");
