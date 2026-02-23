# HYEAN Website Zero-Base Repositioning Plan

> Date: 2026-02-21  
> Scope: `apps/hyean-web` (Corporate site, public-facing UX/IA/message)

## 1. Why This Re-diagnosis

The current build is stable and readable, but it underperforms in two strategic areas:

1. It is still too text-heavy and lacks creative distinction in how trust is shown.
2. Target intent is over-exposed with direct labels (`로컬콘텐츠 중점대학`, `RISE`) instead of signaling capability through outcomes and evidence.

This document resets the site from first principles and defines a new execution plan.

## 2. Fact-Based Current Diagnosis

### 2.1 Text-heavy composition is structural, not cosmetic

- Project visuals are globally disabled in code:
  - `apps/hyean-web/src/data/site.ts:43` -> `showProjectImages: false`
  - `apps/hyean-web/src/components/project-card.tsx:12` -> image rendering blocked by feature flag
- Placeholder is rendered instead of actual evidence visuals:
  - `apps/hyean-web/src/components/project-card.tsx:29` -> `Portfolio Visual Pending`
- Actual project image assets are mostly missing:
  - `apps/hyean-web/public/images/projects` currently contains only 1 file
- Home section pattern is repetitive (eyebrow + title + paragraph/grid) with low format diversity:
  - `apps/hyean-web/src/app/page.tsx:57`
  - `apps/hyean-web/src/app/page.tsx:74`
  - `apps/hyean-web/src/app/page.tsx:87`
  - `apps/hyean-web/src/app/page.tsx:105`
  - `apps/hyean-web/src/app/page.tsx:120`
  - `apps/hyean-web/src/app/page.tsx:140`

### 2.2 Target naming is too explicit in public surface

- Global nav chips directly expose campaign targets:
  - `apps/hyean-web/src/data/site.ts:27`
  - `apps/hyean-web/src/data/site.ts:28`
  - `apps/hyean-web/src/components/site-header.tsx:19`
- Home audience cards explicitly name target programs:
  - `apps/hyean-web/src/app/page.tsx:9`
  - `apps/hyean-web/src/app/page.tsx:15`
- Dedicated pages and metadata use direct naming:
  - `apps/hyean-web/src/app/for-university/page.tsx:4`
  - `apps/hyean-web/src/app/for-university/page.tsx:12`
  - `apps/hyean-web/src/app/for-rise/page.tsx:4`
  - `apps/hyean-web/src/app/for-rise/page.tsx:12`
- Contact copy and form options reinforce direct targeting:
  - `apps/hyean-web/src/app/contact/page.tsx:15`
  - `apps/hyean-web/src/app/contact/contact-form.tsx:97`
  - `apps/hyean-web/src/app/contact/contact-form.tsx:98`
- Some project titles directly embed the program keyword:
  - `apps/hyean-web/src/data/projects.ts:72`

### 2.3 Current trust metrics are internally valid but externally weak

- Home proof strip is based on simple counts (`services`, `projects`, `tracks`) rather than buyer-relevant evidence:
  - `apps/hyean-web/src/app/page.tsx:49`

## 3. Zero-Base Repositioning Principles

### Principle A: Signal capability, do not label target
- Public site should communicate partner fitness through evidence patterns:
  - multi-stakeholder coordination
  - field execution continuity
  - KPI/reporting discipline
- Program names should move from top-level navigation/copy to:
  - case details
  - proposal decks
  - controlled landing pages (if needed)

### Principle B: Replace text volume with evidence density
- Fewer paragraphs, more proof artifacts:
  - field photo sequences
  - execution timeline strips
  - KPI cards with context
  - deliverable thumbnails (report, deck, workshop outputs)

### Principle C: Distinctive minimalism
- Keep current typography direction and monochrome restraint.
- Differentiate through editorial choreography, not generic hero images:
  - staggered composition
  - asymmetric grids
  - evidence-led visual modules

## 4. New Positioning Architecture (Public)

### 4.1 Messaging frame
- Core message:
  - "지역 프로젝트를 설계에서 실행, 성과관리까지 연결하는 현장형 파트너"
- Supporting frame:
  - "교육·실험·전환을 하나의 운영 구조로 설계"
  - "다기관 협업과 공공형 증빙 체계를 동시에 운영"

### 4.2 Language policy (must / avoid)
- Must use:
  - "지역 실행"
  - "다기관 협업"
  - "성과관리"
  - "현장 기반"
  - "증빙 가능한 결과"
- Avoid on public top layer:
  - direct program names and explicit bidder-style labels

## 5. UX/IA Redesign Blueprint

### 5.1 Navigation redesign
- Replace secondary explicit chips with capability-based entries:
  - `교육·실험 설계`
  - `공공협력 실행`
  - `성과관리 체계`
- Keep direct program landing pages only as optional campaign routes (non-primary).

### 5.2 Home redesign (non-generic, non-hero-image)
- Section 1: Manifest + Evidence Rail
  - short manifesto (1 sentence)
  - right-side or bottom evidence rail with 3 artifact thumbnails
- Section 2: "What We Solve" matrix
  - challenge-based cards (e.g., participation, collaboration friction, reporting quality)
- Section 3: Case Filmstrip
  - horizontal case strip with year/region/type and one key metric each
- Section 4: Execution Model
  - 4-step process as timeline with outputs per phase
- Section 5: CTA with pre-qualification
  - inquiry entry by challenge and desired timeline (not by program name)

### 5.3 Case information structure
- List page taxonomy:
  - by challenge type, execution type, partner type, region
- Detail page sequence:
  - challenge -> intervention -> operational design -> evidence -> outcomes -> related cases
- Program-specific words can appear as contextual facts in body, not as top-line title.

### 5.4 Contact experience
- Inquiry type options should be neutralized:
  - `교육·실험 프로그램`
  - `다기관 협업 프로젝트`
  - `성과관리/보고체계`
  - `기타`
- Add expectation block before form:
  - expected response time
  - required preparation materials
  - initial consultation flow

## 6. Creative Direction Without Cliche

### 6.1 Keep
- Current font direction and monochrome discipline.
- Card/timeline system and restrained motion.

### 6.2 Add (high impact)
- Evidence collage components:
  - document snippets
  - field snapshots
  - process artifacts
- Kinetic but subtle interactions:
  - reveal on scroll for proof modules
  - directional transitions between process steps
- Spatial rhythm:
  - alternate dense and sparse bands
  - asymmetric blocks to avoid template feel

### 6.3 Remove
- Repetitive text-only card walls where visual evidence should exist.

## 7. Execution Plan (Phased)

## Phase 0 (2-3 days): Positioning and copy reset
- Remove explicit target/program naming from public nav and home.
- Rewrite `/for-university`, `/for-rise` into neutral capability pages.
- Neutralize contact form inquiry categories.
- Update project titles/summaries that over-expose program naming in top line.

Deliverables:
- revised copy matrix
- updated route naming policy
- metadata update plan

## Phase 1 (3-5 days): Evidence-first homepage and cases
- Rebuild home sections around "evidence modules" rather than text blocks.
- Turn on images only after minimum viable visual set is ready.
- Introduce case filmstrip + challenge taxonomy.

Deliverables:
- redesigned `src/app/page.tsx`
- updated `src/components/project-card.tsx`
- asset manifest for case visuals

## Phase 2 (3-4 days): Conversion + trust UX
- Refactor contact flow to challenge-based intake.
- Add trust preface and post-submit next-step guidance.
- Add downloadable one-page capability brief (optional).

Deliverables:
- revised `src/app/contact/page.tsx`
- revised `src/app/contact/contact-form.tsx`
- updated inquiry schema mapping

## Phase 3 (ongoing): Campaign separation strategy
- Maintain optional explicit campaign pages only for paid/direct outreach.
- Keep them out of global nav and decide indexing policy by channel purpose.

Deliverables:
- campaign route policy
- SEO/noindex decision matrix

## 8. Acceptance Criteria

- Public top navigation and top-fold copy contain no explicit program naming.
- Home first 2 screens communicate:
  - what HYEAN solves
  - how HYEAN executes
  - what evidence supports it
  in under 20 seconds scan-time.
- At least 6 project visuals are available and wired.
- Inquiry options are capability-based, not program-label-based.
- Case pages show at least 1 quantitative or operational evidence block each.

## 9. Immediate Priority Backlog (P0)

1. Remove `strategicNav` explicit labels from `apps/hyean-web/src/data/site.ts`.
2. Replace home audience labels in `apps/hyean-web/src/app/page.tsx`.
3. Rename and rewrite `apps/hyean-web/src/app/for-university/page.tsx`.
4. Rename and rewrite `apps/hyean-web/src/app/for-rise/page.tsx`.
5. Update contact intro and inquiry types in:
   - `apps/hyean-web/src/app/contact/page.tsx`
   - `apps/hyean-web/src/app/contact/contact-form.tsx`
6. Build visual asset checklist and enable images after minimum set 확보:
   - `apps/hyean-web/src/data/site.ts`
   - `apps/hyean-web/public/images/projects/*`

## 10. Decision Points Needed From Stakeholders

1. Public site policy:
   - absolute removal of direct program wording vs controlled use in case detail only.
2. Campaign routing:
   - keep dedicated explicit LPs (`noindex`) vs full single-surface strategy.
3. Evidence disclosure:
   - which KPI ranges can be public by default.

