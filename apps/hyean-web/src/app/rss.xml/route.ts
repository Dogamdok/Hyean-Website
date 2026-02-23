import { listInsightPosts } from '@/lib/insight-post-store';
import { siteUrl } from '@/lib/site-url';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await listInsightPosts({ includeUnpublished: false, limit: 50 });
  const itemsXml = posts
    .map((post) => {
      const link = `${siteUrl}/insights/${post.slug}`;
      const pubDate = new Date(post.createdAt).toUTCString();
      const updatedDate = new Date(post.updatedAt).toUTCString();
      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${escapeXml(link)}</link>
          <guid>${escapeXml(link)}</guid>
          <description>${escapeXml(post.excerpt)}</description>
          <pubDate>${pubDate}</pubDate>
          <author>${escapeXml(post.author)}</author>
          <category>${escapeXml(post.category)}</category>
          <atom:updated>${updatedDate}</atom:updated>
        </item>
      `;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>HYEAN Insights</title>
    <link>${siteUrl}/insights</link>
    <description>혜안 인사이트 RSS 피드</description>
    <language>ko-KR</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600',
    },
  });
}
