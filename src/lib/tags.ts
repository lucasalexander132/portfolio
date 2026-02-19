// ---------------------------------------------------------------------------
// Tag vocabulary — shared between server (updates.ts) and client (TagFilter)
// ---------------------------------------------------------------------------

export const UPDATE_TAGS = [
  'project-launch',
  'design-thinking',
  'business',
  'community',
  'learning',
] as const

export type UpdateTag = (typeof UPDATE_TAGS)[number]
