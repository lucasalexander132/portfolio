import type { Project } from '@/types/project'

/**
 * Project data for the portfolio showcase.
 *
 * Projects display in the order defined here.
 * Each project follows the challenge/approach/result narrative structure.
 * Content is locale-keyed for i18n support.
 *
 * Image paths use placeholder values - actual images will be added separately.
 */
export const projects = [
  // ============================================
  // PROJECTS
  // ============================================
  {
    id: 'codex-grove',
    title: 'Codex Grove',
    thumbnail: '/images/codex-grove-logo.png',
    images: [
      '/images/codex-grove-logo.png',
      '/images/codex-grove-landing.png',
      '/images/codex-grove-dashboard.png',
      '/images/codex-grove-schedule.png',
    ],
    status: 'coming-soon',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'TanStack Query', '@dnd-kit', 'Radix UI'],
    content: {
      en: {
        tagline: 'Knowledge management platform with AI-powered documentation assistant',
        challenge:
          'Organizations struggle with scattered documentation and tribal knowledge. Finding answers means searching multiple systems, asking colleagues, or recreating information that already exists somewhere.',
        approach:
          'Building a unified platform combining Kanban task management, documentation management, and an AI chat assistant. The AI understands the organization\'s knowledge base through hybrid search, answering questions and guiding users through document creation with interactive prompts.',
        result:
          'Shipping with over 220K+ lines of TypeScript. Features include drag-and-drop Kanban boards, multi-assignee tasks, and an AI assistant with documentation map integration. Performance optimized from 5s to 4.1s LCP with 1.5MB bundle reduction.',
        cursorText: 'Explore the knowledge platform',
      },
      fr: {
        tagline: 'Plateforme de gestion des connaissances avec assistant IA pour la documentation',
        challenge:
          'Les organisations luttent contre une documentation dispersee et un savoir tribal. Trouver des reponses signifie chercher dans plusieurs systemes, demander a des collegues, ou recreer des informations qui existent deja quelque part.',
        approach:
          'Construction d\'une plateforme unifiee combinant gestion de taches Kanban, gestion de documentation et un assistant IA. L\'IA comprend la base de connaissances de l\'organisation grace a une recherche hybride, repondant aux questions et guidant les utilisateurs dans la creation de documents avec des invites interactives.',
        result:
          'Livraison avec plus de 220 000 lignes de TypeScript. Fonctionnalites incluant tableaux Kanban glisser-deposer, taches multi-assignees et un assistant IA avec integration de carte documentaire. Performance optimisee de 5s a 4.1s LCP avec reduction de 1.5MB du bundle.',
        cursorText: 'Explorez la plateforme de connaissances',
      },
    },
  },
  {
    id: 'distill',
    title: 'Distill',
    thumbnail: '/images/distill-logo.jpeg',
    images: [
      '/images/distill-logo.jpeg',
      '/images/distill-2.png',
      '/images/distill-3.png',
    ],
    status: 'coming-soon',
    technologies: ['React', 'Convex', 'Capacitor', 'Clerk', 'ElevenLabs', 'OpenAI', 'Stripe'],
    content: {
      en: {
        tagline: 'Vocabulary learning with AI-generated flashcards and spaced repetition',
        challenge:
          'Language learners waste time on manual flashcard creation. They encounter unknown words while reading but the friction of creating quality cards — finding translations, example sentences, audio — means most words never make it into their study system.',
        approach:
          'Building an all-in-one app where users paste words or photograph text, and get complete flashcards instantly. AI generates contextual sentences at the user\'s level, high-quality TTS provides native pronunciation, and FSRS spaced repetition optimizes review timing.',
        result:
          'Shipping across web, iOS, and Android with 24K lines of TypeScript. Features include OCR text capture, tap-to-select word picking, ElevenLabs voices, Stripe subscriptions, and cross-platform sync. Word to reviewable card in under 30 seconds.',
        cursorText: 'Learn vocabulary faster',
      },
      fr: {
        tagline: 'Apprentissage du vocabulaire avec flashcards generees par IA et repetition espacee',
        challenge:
          'Les apprenants de langues perdent du temps a creer des flashcards manuellement. Ils rencontrent des mots inconnus en lisant, mais la friction de creer des cartes de qualite — trouver des traductions, des phrases d\'exemple, de l\'audio — fait que la plupart des mots n\'arrivent jamais dans leur systeme d\'etude.',
        approach:
          'Construction d\'une application tout-en-un ou les utilisateurs collent des mots ou photographient du texte, et obtiennent des flashcards completes instantanement. L\'IA genere des phrases contextuelles au niveau de l\'utilisateur, le TTS haute qualite fournit la prononciation native, et la repetition espacee FSRS optimise le timing des revisions.',
        result:
          'Livraison sur web, iOS et Android avec 24K lignes de TypeScript. Fonctionnalites incluant capture de texte OCR, selection de mots par toucher, voix ElevenLabs, abonnements Stripe et synchronisation multiplateforme. Du mot a la carte revisable en moins de 30 secondes.',
        cursorText: 'Apprenez le vocabulaire plus vite',
      },
    },
  },
  {
    id: 'rippl',
    title: 'Rippl',
    thumbnail: '/images/Rippl-logo.jpeg',
    images: [
      '/images/Rippl-logo.jpeg',
    ],
    status: 'coming-soon',
    technologies: ['React', 'TypeScript', 'Convex', 'Clerk'],
    content: {
      en: {
        tagline: 'Track and process difficult moments with trauma-informed guidance',
        challenge:
          'People experiencing trauma often feel overwhelmed and disconnected from their experiences. Traditional journaling lacks the structure needed to safely process difficult moments, and therapy workbooks feel clinical and impersonal.',
        approach:
          'Building an app to log traumatic moments as they happen, then work through structured modules based on Janina Fisher\'s trauma-informed framework. Gentle prompts help users understand their responses, identify patterns, and develop self-compassion.',
        result:
          'In development. Focused on creating a safe, private space for trauma processing with guided exercises adapted from clinical approaches.',
        cursorText: 'Process with compassion',
      },
      fr: {
        tagline: 'Suivez et traitez les moments difficiles avec un accompagnement informe par le trauma',
        challenge:
          'Les personnes vivant un traumatisme se sentent souvent submergees et deconnectees de leurs experiences. Le journaling traditionnel manque de la structure necessaire pour traiter les moments difficiles en securite, et les cahiers de therapie semblent cliniques et impersonnels.',
        approach:
          'Construction d\'une application pour consigner les moments traumatiques au moment ou ils surviennent, puis travailler a travers des modules structures bases sur le cadre informe par le trauma de Janina Fisher. Des invites douces aident les utilisateurs a comprendre leurs reactions, identifier des patterns et developper l\'auto-compassion.',
        result:
          'En developpement. Concentre sur la creation d\'un espace sur et prive pour le traitement des traumatismes avec des exercices guides adaptes des approches cliniques.',
        cursorText: 'Traitez avec compassion',
      },
    },
  },
  {
    id: 'civix-solutions',
    title: 'Civix Solutions',
    thumbnail: '/images/civix-solutions-apps-logo.png',
    images: [
      '/images/civix-solutions-apps-logo.png',
      '/images/civix-solutions-2.png',
    ],
    status: 'coming-soon',
    technologies: ['Next.js', 'React', 'Convex', 'Clerk', 'Claude API', 'TypeScript'],
    content: {
      en: {
        tagline: 'AI-powered PDF data extraction with custom schemas',
        challenge:
          'Companies processing contracts and documents need to extract structured data reliably. Manual data entry is slow and error-prone, while generic OCR tools lack the intelligence to understand document context.',
        approach:
          'Built a schema-first extraction platform where users define custom formats (text, dates, numbers, booleans) with example-based templates. Claude AI extracts data against the schema, providing confidence scores and AI notes for each field to make review fast and trustworthy.',
        result:
          'Production-ready with comprehensive security hardening. Features include custom schema builder, batch PDF processing, OCR support, confidence-scored extractions, and spreadsheet export. Built with i18n (French/English) from day one.',
        cursorText: 'See the extraction platform',
      },
      fr: {
        tagline: 'Extraction de donnees PDF alimentee par IA avec schemas personnalises',
        challenge:
          'Les entreprises traitant des contrats et documents ont besoin d\'extraire des donnees structurees de maniere fiable. La saisie manuelle est lente et sujette aux erreurs, tandis que les outils OCR generiques manquent de l\'intelligence pour comprendre le contexte des documents.',
        approach:
          'Construction d\'une plateforme d\'extraction axee sur les schemas ou les utilisateurs definissent des formats personnalises (texte, dates, nombres, booleens) avec des modeles bases sur des exemples. Claude AI extrait les donnees selon le schema, fournissant des scores de confiance et des notes IA pour chaque champ pour rendre la revision rapide et fiable.',
        result:
          'Pret pour la production avec un renforcement de securite complet. Fonctionnalites incluant constructeur de schemas personnalises, traitement PDF par lots, support OCR, extractions avec scores de confiance et export tableur. Construit avec i18n (francais/anglais) des le premier jour.',
        cursorText: 'Voir la plateforme d\'extraction',
      },
    },
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
