import type { SpaceAsset } from '@/types/content';

export const spaces: SpaceAsset[] = [
  {
    slug: 'beyond-village',
    name: '부여 비욘드 빌리지',
    address: '충청남도 부여군 규암면 수북로 38-1',
    summary:
      '행정안전부 청년마을 만들기 사업의 일환으로 조성된 로컬 거점으로, 지속가능한 모험 관광을 위한 숙소·전시·실험 기능을 운영합니다.',
    features: [
      '로컬 실행형 체류 프로그램 운영',
      '숙소·전시·실험 기능을 결합한 복합 거점',
      '지역 프로젝트 기반 커뮤니티 운영',
    ],
    relatedProjectSlugs: ['beyond-village-youth-town-buyeo', 'buyeo-youth-tourism-pilot-camp'],
  },
  {
    slug: 'beyond-lab',
    name: '비욘드 랩',
    address: '충남 부여군 비욘드 빌리지 내',
    summary:
      '다음 세대를 위한 실험실로, 폐플라스틱 새활용 시스템과 Repair & Reuse 운동의 거점 설비를 보유하고 있습니다.',
    features: [
      '순환경제 기반 로컬 실험 인프라',
      '교육/실습 연계 가능한 메이킹 환경',
      '수선·재사용 문화 확산 거점',
    ],
    facilities: [
      '새활용 시스템: 파쇄, 용융, 성형, 압출',
      '의류/장비 수선 설비',
      'Repair & Reuse 프로그램 운영 기반',
    ],
    relatedProjectSlugs: ['beyond-village-youth-town-buyeo', 'local-impact-school-multi-city'],
  },
  {
    slug: 'beyond-house',
    name: '비욘드 하우스',
    address: '충남 부여읍 (중기 체류형 쉐어하우스)',
    summary:
      '비욘드 빌리지의 단기 체류 숙소 5개와 별도로, 중기 체류를 위한 쉐어하우스를 운영해 로컬 체류의 연속성을 지원합니다.',
    features: [
      '단기-중기 체류 연계 구조',
      '프로젝트 참여자/실험팀 체류 지원',
      '지역 정착형 활동 기반 제공',
    ],
    facilities: ['단기 체류 숙소 5개(비욘드 빌리지)', '중기 체류 쉐어하우스(부여읍)'],
    relatedProjectSlugs: ['beyond-village-youth-town-buyeo'],
  },
];

export const spaceMap = new Map(spaces.map((space) => [space.slug, space]));
