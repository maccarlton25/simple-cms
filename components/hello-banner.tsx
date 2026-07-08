import { showHelloBanner } from '@/flags';

export async function HelloBanner() {
  const enabled = await showHelloBanner();
  if (!enabled) return null;

  return (
    <div className="w-full bg-zinc-900 text-white dark:bg-white dark:text-black">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 px-6 py-2.5 text-sm">
        <span className="inline-flex h-5 items-center rounded-full bg-white/15 px-2 text-[11px] font-medium tracking-wide uppercase dark:bg-black/10">
          Hello world
        </span>
        <span className="text-zinc-200 dark:text-zinc-700">
          Welcome to simple-cms — powered by Sanity + Vercel Flags
        </span>
        <span aria-hidden className="ml-1 opacity-60">✦</span>
      </div>
    </div>
  );
}
