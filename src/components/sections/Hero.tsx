export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center pt-20"
    >
      {/* Atmospheric background layers */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-base-900 via-base-950 to-base-950"
        aria-hidden="true"
      />

      {/* Golden hour warm glow */}
      <div
        className="absolute top-1/4 -left-1/4 w-3/4 h-1/2 rounded-full blur-[120px] opacity-30"
        style={{
          background: 'radial-gradient(circle, oklch(0.75 0.12 72 / 0.4) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-[var(--container-padding)]">
        <div className="max-w-3xl">
          {/* Empathy-first headline */}
          <h1 className="text-display font-serif text-text-primary mb-6">
            Been burned by developers before?
          </h1>

          {/* Value proposition */}
          <p className="text-h3 font-sans text-text-secondary max-w-2xl mb-12">
            I get it. You hired someone who promised the world and disappeared.
            Let&apos;s skip the sales pitch and talk about what you actually need.
          </p>

          {/* Scroll hint */}
          <a
            href="#services"
            className="group inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>See how I can help</span>
            <span
              className="group-hover:translate-y-0.5 transition-transform"
              aria-hidden="true"
            >
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
