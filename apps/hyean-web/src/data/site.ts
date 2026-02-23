import type { CompanyProfile, NavItem } from '@/types/content';

export const companyProfile: CompanyProfile = {
  nameKo: '주식회사 혜안',
  nameEn: 'HYEAN Co., Ltd.',
  legalName: '(주)혜안',
  ceo: '김도경',
  businessNumber: '414-88-00075',
  credentials: ['인증 사회적기업(인증번호: 제2019-309호)', '사회연대경제조직'],
  phone: '041-835-3588',
  fax: '041-837-3588',
  email: 'info@hyean.org',
  website: 'https://hyean.org',
  headquarters: '충청남도 부여군 규암면 수북로 14-10, 201호',
  branch: '세종특별자치시 한누리대로 165, 409호',
};

export const mainNav: NavItem[] = [
  { label: '홈', href: '/' },
  { label: '회사소개', href: '/about' },
  { label: '서비스', href: '/services' },
  { label: '프로젝트', href: '/projects' },
  { label: '공간과 시설', href: '/spaces' },
  { label: '인사이트', href: '/insights' },
  { label: '문의', href: '/contact' },
];

export const strategicNav: NavItem[] = [
  { label: '교육·실험 설계', href: '/capabilities/learning-execution' },
  { label: '공공협력 실행', href: '/capabilities/collaboration-execution' },
  { label: '성과관리 체계', href: '/capabilities/performance-management' },
  { label: '인증 사회적기업', href: '/about#credentials' },
  { label: '사회연대경제조직', href: '/about#credentials' },
];

export const brandStatement = {
  headline: '더 나은 세상을 만드는 혜안',
  subheadline: '지역사회를 활성화하고, 변화를 증폭시키다',
  mission:
    '혜안은 지역 기반 프로젝트를 설계-실행-성과관리까지 연결해, 증빙 가능한 결과로 다음 단계를 만듭니다.',
};

/**
 * Global experience flags for staged rollout.
 * Keep project images off until final portfolio assets are delivered.
 */
export const experienceConfig = {
  showProjectImages: true,
} as const;
