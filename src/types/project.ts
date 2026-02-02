/**
 * Project Type Definitions
 *
 * Discriminated union pattern for live vs coming-soon projects.
 * TypeScript enforces that live projects have a URL and coming-soon
 * projects cannot have one.
 */

export type ProjectStatus = 'live' | 'coming-soon'

/**
 * Base interface with shared fields for all projects
 */
interface BaseProject {
  /** Unique identifier for the project (used as key and URL slug) */
  id: string
  /** Project display title */
  title: string
  /** One-line description for cards */
  tagline: string
  /** Path to card thumbnail image */
  thumbnail: string
  /** Array of paths to gallery images for modal */
  images: string[]
  /** The problem or pain point addressed */
  challenge: string
  /** How the solution was built */
  approach: string
  /** Quantified outcomes (with specific numbers when possible) */
  result: string
  /** Technologies used */
  technologies: string[]
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
