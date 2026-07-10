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
  {
    _id: "demo-1",
    title: "Hello from Sanity",
    slug: "hello-from-sanity",
    excerpt: "This is placeholder content — connect Sanity to see real posts.",
    publishedAt: new Date().toISOString(),
  },
  {
    _id: "demo-2",
    title: "How this demo works",
    slug: "how-it-works",
    excerpt:
      "Next.js fetches GROQ queries via next-sanity. Edit schema in sanity/schema.ts.",
  },
];

const SETUP_STEPS = [
  "Create a free Sanity project and copy the project ID.",
  "Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to .env.local.",
  "Open Studio, create a post, publish, then refresh the homepage.",
];

const FEATURES = [
  "Embedded Studio at /studio",
  "Post schema and GROQ queries included",
  "ISR-backed content refresh every 60 seconds",
];

export default async function Home() {
  let posts: Post[] = DEMO_POSTS;
  let configured = isSanityConfigured();
  let error: string | null = null;

  if (configured) {
    try {
      const fetched = await client.fetch<Post[]>(POSTS_QUERY, {}, { next: { revalidate: 60 } });
      if (fetched?.length) posts = fetched;
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : "Failed to fetch from Sanity";
      configured = false;
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f2ea] text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <section className="relative border-b border-black/10 dark:border-white/10">
        <div className="absolute inset-x-0 top-0 -z-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.25),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.2),_transparent_30%)]" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-8 sm:py-12 lg:flex-row lg:items-center lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                simple-cms
              </Link>
              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-zinc-200">
                {configured ? "Sanity connected" : "Demo mode"}
              </span>
            </div>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">
              Next.js + Sanity starter
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              A tiny CMS demo with a polished front door. Created by MAC!
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
              Publish posts from Sanity Studio, render them with Next.js, and keep the demo lightweight enough to understand in one sitting.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/studio"
                className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Open Studio
              </Link>
              <a
                href="#posts"
                className="rounded-full border border-black/10 bg-white/75 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                View posts
              </a>
            </div>
          </div>

          <div className="grid flex-1 gap-4 rounded-[2rem] border border-black/10 bg-white/70 p-4 shadow-2xl shadow-amber-900/10 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:shadow-black/20">
            <div className="rounded-[1.5rem] bg-zinc-950 p-6 text-white dark:bg-black">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300">
                Included
              </p>
              <ul className="mt-5 space-y-3 text-sm text-zinc-300">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-1 size-2 rounded-full bg-amber-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["/studio", "Studio"],
                ["60s", "Revalidate"],
                [posts.length.toString(), "Posts"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/10"
                >
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/10">
          <h2 className="text-xl font-semibold">Launch checklist</h2>
          <ol className="mt-5 space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
            {SETUP_STEPS.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-900 dark:bg-amber-300 dark:text-black">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {!configured && (
            <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-900/60">
              <p className="font-semibold">Currently showing demo content.</p>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-zinc-950 p-3 text-xs text-zinc-100">
{`NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production`}
              </pre>
              {error && <p className="mt-3 text-xs text-red-600 dark:text-red-300">Error: {error}</p>}
            </div>
          )}
        </div>

        <div id="posts" className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
                Latest content
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Posts</h2>
            </div>
            <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-zinc-950">
              {configured ? "Live" : "Sample"}
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={configured ? `/posts/${post.slug}` : "/studio"}
                className="group rounded-3xl border border-black/10 bg-[#fbf8f1] p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-900/10 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-amber-300/60"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight group-hover:text-amber-700 dark:group-hover:text-amber-300">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  {post.publishedAt && (
                    <p className="shrink-0 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                      {new Date(post.publishedAt).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
