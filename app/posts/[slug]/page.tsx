import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { client, isSanityConfigured } from "@/sanity/lib/client";
import { POST_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  if (!isSanityConfigured()) notFound();

  const post = await client.fetch(
    POST_QUERY,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
        ← Back
      </Link>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight">{post.title}</h1>
      {post.publishedAt && (
        <p className="mt-2 text-sm text-zinc-500">
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
      )}
      {post.excerpt && (
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>
      )}
      {post.body && (
        <div className="prose dark:prose-invert mt-10 max-w-none">
          <PortableText value={post.body} />
        </div>
      )}
    </article>
  );
}
