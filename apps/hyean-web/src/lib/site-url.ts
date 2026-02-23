const defaultSiteUrl = 'https://hyean.org';

function normalizeSiteUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_BASE_URL ?? '') ?? defaultSiteUrl;

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteUrl}${normalizedPath}`;
}
