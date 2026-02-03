import type { Project } from '@/types/project'

/**
 * Project data for the portfolio showcase.
 *
 * Projects are sorted in the UI with live projects first, then coming-soon.
 * Each project follows the challenge/approach/result narrative structure.
 *
 * Image paths use placeholder values - actual images will be added separately.
 */
export const projects = [
  // ============================================
  // LIVE PROJECTS
  // ============================================
  {
    id: 'codex-grove',
    title: 'Codex Grove',
    tagline: 'AI-powered knowledge management for developers',
    thumbnail: '/images/codex-grove-landing.png',
    images: [
      '/images/codex-grove-landing.png',
      '/images/codex-grove-dashboard.png',
      '/images/codex-grove-schedule.png',
    ],
    status: 'live',
    url: 'https://codexgrove.com',
    challenge:
      'Developers waste hours searching through documentation, Stack Overflow, and old code for answers they\'ve found before. Knowledge gets lost in chat threads and forgotten bookmarks.',
    approach:
      'Built an AI-powered knowledge base that learns from your codebase and conversations. Automatically indexes and connects related concepts, surfacing relevant context exactly when needed.',
    result:
      'Early users report 40% less time spent searching for information. The system learns and improves with each interaction, becoming more valuable over time.',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'OpenAI', 'Tailwind CSS'],
    cursorText: 'Manage your employees with ease',
  },
  {
    id: 'local-inventory',
    title: 'Local Business Inventory System',
    tagline: 'Real-time stock tracking that actually works offline',
    thumbnail: '/projects/local-inventory/thumbnail.jpg',
    images: [
      '/projects/local-inventory/screenshot-1.jpg',
      '/projects/local-inventory/screenshot-2.jpg',
    ],
    status: 'live',
    url: 'https://example.com/inventory-system',
    githubUrl: 'https://github.com/example/local-inventory',
    challenge:
      'A retail shop with spotty WiFi was losing sales because their cloud-based inventory system would crash during peak hours. They needed something that worked offline first.',
    approach:
      'Designed a progressive web app with local-first architecture. Data syncs when online but the app remains fully functional offline. Added barcode scanning and low-stock alerts.',
    result:
      'Zero downtime during the first holiday season after launch. Reduced out-of-stock incidents by 67% through automated reorder alerts.',
    technologies: ['React', 'TypeScript', 'IndexedDB', 'Service Workers'],
  },

  // ============================================
  // COMING SOON PROJECTS
  // ============================================
  {
    id: 'appointment-scheduler',
    title: 'Smart Appointment Scheduler',
    tagline: 'Booking that adapts to how your business actually works',
    thumbnail: '/projects/appointment-scheduler/thumbnail.jpg',
    images: ['/projects/appointment-scheduler/screenshot-1.jpg'],
    status: 'coming-soon',
    githubUrl: 'https://github.com/example/appointment-scheduler',
    challenge:
      'Service businesses struggle with off-the-shelf scheduling tools that force rigid time slots. They need flexibility for different service types without confusing customers.',
    approach:
      'Building a scheduler that learns from booking patterns. Variable duration services, buffer time between appointments, and smart conflict resolution.',
    result:
      'Currently in development. Early testing shows 40% faster booking flow compared to existing solutions.',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
  },
  {
    id: 'client-portal',
    title: 'Client Communication Portal',
    tagline: 'Stop losing important messages in email threads',
    thumbnail: '/projects/client-portal/thumbnail.jpg',
    images: ['/projects/client-portal/screenshot-1.jpg'],
    status: 'coming-soon',
    githubUrl: 'https://github.com/example/client-portal',
    challenge:
      'Agencies and freelancers spend too much time searching through email threads for feedback, approvals, and file versions. Communication gets lost and deadlines slip.',
    approach:
      'Creating a focused portal for project communication. Threaded discussions tied to deliverables, version history with visual diffs, and deadline tracking.',
    result:
      'In active development. Targeting 50% reduction in time spent searching for client feedback.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
  },
] as const satisfies readonly Project[]

/**
 * Type representing valid project IDs for type-safe lookups
 */
export type ProjectId = (typeof projects)[number]['id']

/**
 * Get a project by ID with type safety
 *
 * @param id - The project ID to find
 * @returns The project or undefined if not found
 */
export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}
