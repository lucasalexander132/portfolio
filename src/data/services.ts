import type { Locale } from '@/lib/i18n'

// Export Locale type for external use
export type { Locale }

interface Service {
  id: string
  number: string
  content: {
    [K in Locale]: {
      title: string
      description: string
      cursorText: string
    }
  }
}

export const services: Service[] = [
  {
    id: 'development',
    number: '01',
    content: {
      en: {
        title: 'Custom Development',
        description:
          "If you're tired of templates that don't fit, I build exactly what your business needs - no more, no less. Every line of code serves a purpose.",
        cursorText: 'Like this site',
      },
      fr: {
        title: 'Developpement sur mesure',
        description:
          "Si vous en avez assez des templates qui ne correspondent pas, je construis exactement ce dont votre entreprise a besoin - ni plus, ni moins. Chaque ligne de code a un but.",
        cursorText: 'Comme ce site',
      },
    },
  },
  {
    id: 'communication',
    number: '02',
    content: {
      en: {
        title: 'Ongoing Communication',
        description:
          "If you've been ghosted before, you'll appreciate weekly updates and responses within hours, not days. You'll always know where your project stands.",
        cursorText: 'No ghosts here',
      },
      fr: {
        title: 'Communication continue',
        description:
          "Si vous avez deja ete ignore, vous apprecierez les mises a jour hebdomadaires et les reponses en quelques heures, pas en jours. Vous saurez toujours ou en est votre projet.",
        cursorText: 'Je reponds toujours',
      },
    },
  },
  {
    id: 'iteration',
    number: '03',
    content: {
      en: {
        title: 'Fast Iteration',
        description:
          "If you're watching competitors move faster, I help you ship improvements in days instead of months. Speed without sacrificing quality.",
        cursorText: "I'm addicted to work",
      },
      fr: {
        title: 'Iteration rapide',
        description:
          "Si vous voyez vos concurrents avancer plus vite, je vous aide a livrer des ameliorations en jours plutot qu'en mois. La vitesse sans sacrifier la qualite.",
        cursorText: 'Accro au travail',
      },
    },
  },
]
