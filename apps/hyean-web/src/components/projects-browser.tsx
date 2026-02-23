'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { ProjectCase } from '@/types/content';
import { ProjectCard } from '@/components/project-card';

type ProjectsBrowserProps = {
  projects: ProjectCase[];
};

const statusOptions: Array<{ value: 'all' | ProjectCase['status']; label: string }> = [
  { value: 'all', label: '전체 상태' },
  { value: 'migrated', label: '이관 완료' },
  { value: 'draft', label: '작성 중' },
];

export function ProjectsBrowser({ projects }: ProjectsBrowserProps) {
  const [query, setQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectCase['status']>('all');

  const years = useMemo(() => {
    const values = projects
      .map((project) => project.year ?? project.period)
      .filter((value): value is string => Boolean(value));
    return Array.from(new Set(values)).sort((a, b) => b.localeCompare(a));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const periodLabel = project.year ?? project.period;
      const matchesYear = yearFilter === 'all' || periodLabel === yearFilter;
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        project.title.toLowerCase().includes(normalizedQuery) ||
        project.summary.toLowerCase().includes(normalizedQuery) ||
        project.region.toLowerCase().includes(normalizedQuery) ||
        project.client.toLowerCase().includes(normalizedQuery) ||
        project.focus.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesYear && matchesStatus && matchesQuery;
    });
  }, [projects, query, statusFilter, yearFilter]);

  const resetFilters = () => {
    setQuery('');
    setYearFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="project-browser section-stack-md">
      <div className="project-toolbar" role="region" aria-label="프로젝트 필터">
        <div className="project-search">
          <Search size={16} aria-hidden="true" />
          <input
            id="project-search"
            type="search"
            value={query}
            placeholder="프로젝트명, 지역, 키워드 검색"
            onChange={(event) => setQuery(event.target.value)}
            aria-label="프로젝트 검색"
          />
        </div>

        <div className="project-filters">
          <label className="toolbar-select">
            <span>연도</span>
            <select
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              aria-label="프로젝트 연도 필터"
            >
              <option value="all">전체 연도</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <div className="status-chips" role="group" aria-label="프로젝트 상태 필터">
            <span className="status-chip-label">
              <SlidersHorizontal size={14} aria-hidden="true" />
              상태
            </span>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`filter-chip${statusFilter === option.value ? ' is-active' : ''}`}
                onClick={() => setStatusFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button type="button" className="toolbar-reset" onClick={resetFilters}>
            필터 초기화
          </button>
        </div>
      </div>

      <p className="project-result-summary">
        {filteredProjects.length}개 프로젝트가 검색되었습니다.
      </p>

      {filteredProjects.length > 0 ? (
        <div className="grid-3">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} priorityImage={index < 3} />
          ))}
        </div>
      ) : (
        <div className="empty-state card">
          <h3>조건에 맞는 프로젝트가 없습니다.</h3>
          <p className="muted">
            검색어를 줄이거나 필터를 초기화해보세요. 유사 사례가 필요하면 문의 페이지에서 요청할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
