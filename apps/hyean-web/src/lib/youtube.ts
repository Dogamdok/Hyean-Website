export function getYouTubeVideoId(rawUrl?: string): string | null {
  if (!rawUrl) return null;

  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.replace('www.', '');

    if (host === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] ?? null;
    }

    if (host.includes('youtube.com')) {
      const byQuery = parsed.searchParams.get('v');
      if (byQuery) return byQuery;

      const pathParts = parsed.pathname.split('/').filter(Boolean);
      const embedIndex = pathParts.findIndex((part) => part === 'embed');
      if (embedIndex >= 0 && pathParts[embedIndex + 1]) {
        return pathParts[embedIndex + 1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeEmbedUrl(rawUrl?: string): string | null {
  const videoId = getYouTubeVideoId(rawUrl);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}
