# Requirements: Civix Solutions Portfolio v1.1

**Defined:** 2026-02-03
**Core Value:** Visitors must feel at ease — like they've found someone who genuinely cares about solving their problem.
**Milestone Focus:** Internationalization (English/French) with instant client-side switching

## v1.1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Infrastructure

- [ ] **I18N-01**: LocaleProvider with React Context enables instant language switching
- [ ] **I18N-02**: Translation files (en.json, fr.json) contain all UI strings
- [ ] **I18N-03**: Browser language detection sets initial locale via navigator.language
- [ ] **I18N-04**: TypeScript types enforce translation key safety at compile time

### Language Switcher

- [ ] **I18N-05**: Language toggle in navbar displays FR on top, EN on bottom
- [ ] **I18N-06**: Clicking language option switches all text instantly (no page reload)

### Content Translation

- [ ] **I18N-07**: Hero section content available in French
- [ ] **I18N-08**: Services section content available in French
- [ ] **I18N-09**: Projects section content available in French (case studies, tech tags)
- [ ] **I18N-10**: Contact form labels, placeholders, and validation messages in French
- [ ] **I18N-11**: Navigation labels available in French
- [ ] **I18N-12**: Footer content available in French
- [ ] **I18N-13**: Cursor hover text available in French

## Future Requirements

Deferred to later milestones. Tracked but not in current roadmap.

### Enhancements

- **V2-I18N-01**: Missing translation key warnings in development mode
- **V2-I18N-02**: Animated text transition during language switch
- **V2-I18N-03**: Professional French translation review for emotional content
- **V2-I18N-04**: hreflang meta tags for SEO

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| URL-based routing (`/en/`, `/fr/`) | Single-page site doesn't need localized URLs |
| Server-side locale detection | Client-side navigator.language is sufficient |
| Language persistence (localStorage/cookies) | User specified no persistence — detect fresh each visit |
| CMS for translations | JSON files are appropriate for ~60 strings |
| i18n libraries (next-intl, react-i18next) | Require page refresh; custom Context is simpler for instant switching |
| Additional languages | Only EN/FR needed for current market |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| I18N-01 | TBD | Pending |
| I18N-02 | TBD | Pending |
| I18N-03 | TBD | Pending |
| I18N-04 | TBD | Pending |
| I18N-05 | TBD | Pending |
| I18N-06 | TBD | Pending |
| I18N-07 | TBD | Pending |
| I18N-08 | TBD | Pending |
| I18N-09 | TBD | Pending |
| I18N-10 | TBD | Pending |
| I18N-11 | TBD | Pending |
| I18N-12 | TBD | Pending |
| I18N-13 | TBD | Pending |

**Coverage:**
- v1.1 requirements: 13 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 13

---
*Requirements defined: 2026-02-03*
*Last updated: 2026-02-03 after initial definition*
