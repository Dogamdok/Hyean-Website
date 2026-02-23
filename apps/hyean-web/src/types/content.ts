export type NavItem = {
  label: string;
  href: string;
};

export type Service = {
  key: string;
  name: string;
  summary: string;
  details: string[];
};

export type ProjectCase = {
  slug: string;
  title: string;
  summary: string;
  overview: string;
  challengeType: string;
  engagementType: string;
  proofLine: string;
  period: string;
  year?: string;
  region: string;
  client: string;
  role: string;
  portfolioTier: 'featured' | 'archive';
  youtubeUrl?: string;
  imageUrl?: string;
  imageUrls?: string[];
  imageFitMode?: 'cover' | 'contain';
  imageBackdropColor?: string;
  hasImageAsset?: boolean;
  focus: string[];
  execution: string[];
  results: string[];
  metrics?: Array<{
    label: string;
    value: string;
  }>;
  evidenceStatement?: string;
  updatedAt?: string;
  sourceCitations?: Array<{
    label: string;
    url?: string;
    type?: 'internal' | 'external';
  }>;
  status: 'migrated' | 'draft';
  sources: string[];
};

export type LegacyInsightPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string[];
  tags: string[];
  status: 'migrated' | 'draft';
  sources: string[];
};

export type InsightPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage: string;
  tags: string[];
  sources: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InsightPostCreateInput = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage: string;
  tags?: string[];
  sources?: string[];
  isPublished?: boolean;
};

export type CompanyProfile = {
  nameKo: string;
  nameEn: string;
  legalName: string;
  ceo: string;
  businessNumber: string;
  credentials?: string[];
  phone: string;
  fax: string;
  email: string;
  website: string;
  headquarters: string;
  branch: string;
};

export type SpaceAsset = {
  slug: string;
  name: string;
  address: string;
  summary: string;
  features: string[];
  facilities?: string[];
  relatedProjectSlugs?: string[];
};
