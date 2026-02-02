import { Code, MessageSquare, Zap } from 'lucide-react'

const services = [
  {
    icon: Code,
    title: 'Custom Development',
    description:
      "If you're tired of templates that don't fit, I build exactly what your business needs — no more, no less.",
  },
  {
    icon: MessageSquare,
    title: 'Ongoing Communication',
    description:
      "If you've been ghosted before, you'll appreciate weekly updates and responses within hours, not days.",
  },
  {
    icon: Zap,
    title: 'Fast Iteration',
    description:
      "If you're watching competitors move faster, I help you ship improvements in days instead of months.",
  },
]

export function Services() {
  return (
    <section id="services" className="py-[var(--spacing-section)]">
      <div className="mx-auto max-w-6xl px-[var(--container-padding)]">
        {/* Section header */}
        <h2 className="text-h1 font-serif text-text-primary mb-4">
          How I Can Help
        </h2>
        <p className="text-body text-text-secondary max-w-2xl mb-12">
          Every project starts with a conversation — no pressure, no commitment.
          Just two people figuring out if we&apos;re a good fit.
        </p>

        {/* Service cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="card-grain p-8 bg-base-800 rounded-xl shadow-elevation-sm"
            >
              <service.icon
                className="text-amber-500 mb-6"
                size={32}
                strokeWidth={1.5}
              />
              <h3 className="text-h3 font-serif text-text-primary mb-3">
                {service.title}
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
