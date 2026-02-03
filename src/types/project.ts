/**
 * Project Type Definitions
 *
 * Discriminated union pattern for live vs coming-soon projects.
 * TypeScript enforces that live projects have a URL and coming-soon
 * projects cannot have one.
 */

import type { Locale } from '@/lib/i18n'

export type ProjectStatus = 'live' | 'coming-soon'

/**
 * Localized content for translatable project fields
 */
export interface LocalizedContent {
  tagline: string
  challenge: string
  approach: string
  result: string
  cursorText?: string
}

/**
 * Base interface with shared fields for all projects
 */
interface BaseProject {
  /** Unique identifier for the project (used as key and URL slug) */
  id: string
  /** Project display title (kept as string - proper noun) */
  title: string
  /** Path to card thumbnail image */
  thumbnail: string
  /** Array of paths to gallery images for modal */
  images: string[]
  /** Technologies used */
  technologies: string[]
  /** Locale-keyed content for translations */
  content: {
    [K in Locale]: LocalizedContent
  }
}

/**
 * Live project - deployed and accessible
 * URL is required for live projects
 */
export interface LiveProject extends BaseProject {
  status: 'live'
  /** Live project URL (required) */
  url: string
  /** Optional GitHub repository link */
  githubUrl?: string
}

/**
 * Coming soon project - in development
 * URL is explicitly disallowed
 */
export interface ComingSoonProject extends BaseProject {
  status: 'coming-soon'
  /** GitHub repository link (optional) */
  githubUrl?: string
  /** Explicitly disallow live URL for coming-soon projects */
  url?: never
}

/**
 * Union type for all project states
 */
export type Project = LiveProject | ComingSoonProject

/**
 * Type guard to narrow Project to LiveProject
 *
 * @param project - The project to check
 * @returns true if the project is live
 *
 * @example
 * if (isLiveProject(project)) {
 *   // project.url is guaranteed to exist here
 *   console.log(project.url)
 * }
 */
export function isLiveProject(project: Project): project is LiveProject {
  return project.status === 'live'
}

/**
 * Type guard to narrow Project to ComingSoonProject
 *
 * @param project - The project to check
 * @returns true if the project is coming soon
 */
export function isComingSoonProject(
  project: Project
): project is ComingSoonProject {
  return project.status === 'coming-soon'
}
