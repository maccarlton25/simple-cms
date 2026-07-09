import Link from "next/link";
import { client, isSanityConfigured } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
};

const DEMO_POSTS: Post[] = [
  { _id: "demo-1", title: "Hello from Sanity", slug: "hello-from-sanity", excerpt: "This is placeholder content — connect Sanity to see real posts.", publishedAt: new Date().toISOString() },
  { _id: "demo-2", title: "How this demo works", slug: "how-it-works", excerpt: "Next.js fetches GROQ queries via next-sanity. Edit schema in sanity/schema.ts." },
];

export default async function Home() {
  let posts: Post[] = DEMO_POSTS;
  let configured = isSanityConfigured();
  let error: string | null = null;

  if (configured) {
    try {
      const fetched = await client.fetch<Post[]>(POSTS_QUERY, {}, { next: { revalidate: 60 } });
      if (fetched?.length) posts = fetched;
      // if empty, keep demo posts but mark configured so user knows it's connected
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : "Failed to fetch from Sanity";
      configured = false;
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-900 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            simple-cms
          </Link>
          <div className="flex items-center gap-3">
            {!configured ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                demo mode
              </span>
            ) : (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                connected
              </span>
            )}
            <Link
              href="/studio"
              className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Open Studio
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {!configured && (
          <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
            <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Connect your free Sanity account (2 min)
            </h2>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-amber-800/90 dark:text-amber-200/80">
              <li>
                Go to{" "}
                <a className="underline" href="https://www.sanity.io/manage" target="_blank">
                  sanity.io/manage
                </a>{" "}
                → Create project (free) → copy <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">Project ID</code>
              </li>
              <li>
                Create a <code>.env.local</code> file in project root:
                <pre className="mt-2 overflow-x-auto rounded bg-zinc-900 p-3 text-xs text-zinc-100">
{`NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production`}
                </pre>
              </li>
              <li>Restart dev server: <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">pnpm dev</code></li>
              <li>Click <b>Open Studio</b> → create your first Post → Publish → refresh this page</li>
            </ol>
            {error && (
              <p className="mt-3 text-xs text-red-600 dark:text-red-400">Error: {error}</p>
            )}
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {configured ? "Live from Sanity" : "Showing demo data until Sanity is connected."}
        </p>

        <ul className="mt-8 grid gap-4">
          {posts.map((post) => (
            <li
              key={post._id}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <Link href={`/posts/${post.slug}`} className="block">
                <h2 className="text-lg font-semibold group-hover:underline">{post.title}</h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.excerpt}
                  </p>
                )}
                {post.publishedAt && (
                  <p className="mt-3 text-xs text-zinc-400">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-xl bg-zinc-900 p-6 text-zinc-100 dark:bg-zinc-900">
          <h3 className="font-mono text-sm font-semibold">What&apos;s included</h3>
          <ul className="mt-3 space-y-1 font-mono text-xs text-zinc-400">
            <li>• <span className="text-zinc-200">sanity.config.ts</span> — Studio mounted at /studio</li>
            <li>• <span className="text-zinc-200">sanity/schema.ts</span> — Post type (title, slug, excerpt, body)</li>
            <li>• <span className="text-zinc-200">sanity/lib/client.ts</span> — next-sanity client (useCdn: true)</li>
            <li>• <span className="text-zinc-200">sanity/lib/queries.ts</span> — GROQ queries</li>
            <li>• <span className="text-zinc-200">app/page.tsx</span> — list view with ISR (60s)</li>
            <li>• <span className="text-zinc-200">app/posts/[slug]/page.tsx</span> — detail with PortableText</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
