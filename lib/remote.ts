import type { Post, Repo, SiteData } from "./data";

const GH = "https://api.github.com";
const HEADERS = { Accept: "application/vnd.github+json", "User-Agent": "wasaths-terminal" };
const REVALIDATE = 3600;

async function json<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: HEADERS, next: { revalidate: REVALIDATE } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

async function loadPosts(): Promise<Post[]> {
  try {
    const res = await fetch("https://blog.wasath.site/feed.xml", { next: { revalidate: REVALIDATE } });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 8);
    const pick = (s: string, tag: string) =>
      s.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`))?.[1]?.trim();
    return items.flatMap(([, body]) => {
      const title = pick(body, "title");
      const href = pick(body, "link");
      return title && href ? [{ title, href, date: pick(body, "pubDate") }] : [];
    });
  } catch {
    return [];
  }
}

type GhRepo = {
  name: string;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  description: string | null;
  html_url: string;
  fork: boolean;
};

/** Server only. Failures degrade to empty data so the terminal still renders. */
export async function loadSiteData(): Promise<SiteData> {
  const [user, repos, posts] = await Promise.all([
    json<{ followers: number; public_repos: number }>(`${GH}/users/WasathTheekshana`),
    json<GhRepo[]>(`${GH}/users/WasathTheekshana/repos?per_page=100&sort=pushed`),
    loadPosts(),
  ]);

  const mapped: Repo[] = (repos ?? [])
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      language: r.language,
      pushedAt: r.pushed_at,
      description: r.description,
      url: r.html_url,
    }));

  return { repos: mapped, posts, followers: user?.followers ?? null, publicRepos: user?.public_repos ?? null };
}
