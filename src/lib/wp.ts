// const API = import.meta.env.PUBLIC_WP_API_URL

// function assertApi() {
//    if (!API) {
//     return null;
//   }

//   return API;
// }
// export type WPPost = {
// id: number
// slug: string
// date: string
// title: { rendered: string }
// excerpt: { rendered: string }
// content: { rendered: string }
// _embedded?: any
// }
// export async function fetchPosts(params: Record<string, any> = {}): Promise<WPPost[]> {
// assertApi()
// const qs = new URLSearchParams({ per_page: '20', _embed: '1', ...params })
// const res = await fetch(`${API}/posts?${qs.toString()}`)
// if (!res.ok) throw new Error(`WP posts fetch failed: ${res.status}`)
// return res.json()
// }
// export async function fetchAllSlugs(): Promise<string[]> {
// assertApi()
// const posts = await fetchPosts({ per_page: 100 })
// return posts.map(p => p.slug)
// }
// export async function fetchPostBySlug(slug: string): Promise<WPPost | null> {
// assertApi()
// const res = await fetch(`${API}/posts?slug=${encodeURIComponent(slug)}&_embed=1`)
// if (!res.ok) return null
// const data = await res.json()
// return data?.[0] ?? null
// }
// export function getFeaturedImageUrl(post: WPPost): string | null {
// const media = post._embedded?.['wp:featuredmedia']?.[0]
// return media?.source_url ?? null
// }


const API = import.meta.env.PUBLIC_WP_API_URL;

function assertApi() {
  if (!API) {
    throw new Error(
      "PUBLIC_WP_API_URL is not defined in your environment variables."
    );
  }

  return API;
}

export type WPPost = {
  id: number;
  slug: string;
  date: string;

  title: {
    rendered: string;
  };

  excerpt: {
    rendered: string;
  };

  content: {
    rendered: string;
  };

  seo?: {
    title?: string;
    description?: string;
    focus_keyword?: string;
    seo_score?: string;
  };

  _embedded?: any;
};

export async function fetchPosts(
  params: Record<string, any> = {}
): Promise<WPPost[]> {
  const api = assertApi();

  const qs = new URLSearchParams({
    per_page: "20",
    _embed: "1",
    ...params,
  });

  const res = await fetch(`${api}/posts?${qs.toString()}`);

  if (!res.ok) {
    throw new Error(`WP posts fetch failed: ${res.status}`);
  }

  return res.json();
}

export async function fetchAllSlugs(): Promise<string[]> {
  await assertApi();

  const posts = await fetchPosts({ per_page: 100 });

  return posts.map((p) => p.slug);
}

export async function fetchPostBySlug(
  slug: string
): Promise<WPPost | null> {
  const api = assertApi();

  const res = await fetch(
    `${api}/posts?slug=${encodeURIComponent(slug)}&_embed=1`
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data?.[0] ?? null;
}

export function getFeaturedImageUrl(
  post: WPPost
): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  return media?.source_url ?? null;
}