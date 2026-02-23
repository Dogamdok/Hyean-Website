# Campaign Route Policy

> Date: 2026-02-21  
> Scope: Public site vs campaign-specific landing routes

## 1. Objective

Keep the public-facing website capability-driven, while preserving campaign-ready routes for direct outreach channels.

## 2. Route Tiers

### Tier A: Public Core (indexable)
- `/`
- `/about`
- `/services`
- `/projects`
- `/insights`
- `/contact`
- `/capabilities/*`

Policy:
- No explicit program naming in top navigation or top-fold copy.
- Messaging is capability/evidence based.

### Tier B: Campaign Landing (non-indexable)
- `/for-university`
- `/for-rise`

Policy:
- Used only for paid/direct outreach or proposal follow-up.
- `noindex, nofollow` metadata enforced.
- Kept out of global navigation.

## 3. Messaging Rules

### Public Core
- Emphasize:
  - execution capability
  - multi-stakeholder collaboration
  - measurable outcomes and evidence
- Avoid:
  - direct target-program naming in top-level IA

### Campaign Landing
- May include direct program context where operationally needed.
- Must still avoid unverifiable claims.

## 4. Operational Checklist

1. When adding a new route, decide Tier A or Tier B first.
2. If Tier B, set `robots: { index: false, follow: false }`.
3. Never expose Tier B entries in global nav/footer by default.
4. Keep metrics and claims evidence-backed in both tiers.

