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
    id: 'employee-management',
    title: 'Employee Management Dashboard',
    tagline: 'Transformed HR chaos into streamlined operations',
    thumbnail: '/projects/employee-management/thumbnail.jpg',
    images: [
      '/projects/employee-management/screenshot-1.jpg',
      '/projects/employee-management/screenshot-2.jpg',
      '/projects/employee-management/screenshot-3.jpg',
    ],
    status: 'live',
    url: 'https://example.com/employee-dashboard',
    challenge:
      'A growing business was tracking employee hours, PTO, and schedules across three different spreadsheets. HR spent 8+ hours every week just reconciling data and chasing down missing information.',
    approach:
      'Built a unified dashboard with real-time sync, automated PTO calculations, and role-based access. Employees can submit requests directly, and managers get instant notifications.',
    result:
      'Reduced weekly HR admin time from 8 hours to under 2 hours. Eliminated double-booking errors completely and improved employee satisfaction scores by 23%.',
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
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
