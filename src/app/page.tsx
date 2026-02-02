'use client'

export default function Home() {
  return (
    <main className="min-h-dvh p-8 md:p-16">
      {/* Typography showcase */}
      <section className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-display font-serif">Workshop at Golden Hour</h1>
          <p className="text-body text-text-secondary max-w-2xl">
            A well-organized space where interesting things get made. There is a sense
            of craft, of care, of someone who will work through the night while you rest.
          </p>
        </div>

        {/* Type scale */}
        <div className="space-y-4 py-8 border-t border-base-700">
          <h2 className="text-h1 font-serif">Heading 1 (text-h1)</h2>
          <h3 className="text-h2 font-serif">Heading 2 (text-h2)</h3>
          <h4 className="text-h3 font-serif">Heading 3 (text-h3)</h4>
          <p className="text-body">Body text (text-body)</p>
          <p className="text-small text-text-muted">Small text (text-small)</p>
        </div>

        {/* Color palette */}
        <div className="space-y-4 py-8 border-t border-base-700">
          <h2 className="text-h2 font-serif">Color Palette</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-20 h-20 rounded-lg bg-base-950 shadow-sm" title="base-950"></div>
            <div className="w-20 h-20 rounded-lg bg-base-900 shadow-sm" title="base-900"></div>
            <div className="w-20 h-20 rounded-lg bg-base-800 shadow-sm" title="base-800"></div>
            <div className="w-20 h-20 rounded-lg bg-base-700 shadow-sm" title="base-700"></div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="w-20 h-20 rounded-lg bg-amber-600 shadow-sm" title="amber-600"></div>
            <div className="w-20 h-20 rounded-lg bg-amber-500 shadow-sm" title="amber-500"></div>
            <div className="w-20 h-20 rounded-lg bg-amber-400 shadow-sm" title="amber-400"></div>
            <div className="w-20 h-20 rounded-lg bg-amber-300 shadow-sm" title="amber-300"></div>
          </div>
        </div>

        {/* Shadow system */}
        <div className="space-y-6 py-8 border-t border-base-700">
          <h2 className="text-h2 font-serif">Shadow System</h2>
          <p className="text-body text-text-secondary">Layered shadows create depth and elevation hierarchy.</p>

          {/* Elevated cards showing shadow progression */}
          <div className="flex flex-wrap gap-12 items-end py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="card-grain w-36 h-36 rounded-xl bg-base-800 shadow-elevation-sm flex items-center justify-center">
                <span className="text-text-muted text-sm">Small</span>
              </div>
              <span className="text-small text-text-muted">Resting</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="card-grain w-36 h-36 rounded-xl bg-base-800 shadow-elevation-md flex items-center justify-center -translate-y-2">
                <span className="text-text-muted text-sm">Medium</span>
              </div>
              <span className="text-small text-text-muted">Raised</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="card-grain w-36 h-36 rounded-xl bg-base-800 shadow-elevation-lg flex items-center justify-center -translate-y-4">
                <span className="text-text-muted text-sm">Large</span>
              </div>
              <span className="text-small text-text-muted">Floating</span>
            </div>
          </div>

          {/* Interactive hover demo */}
          <div className="space-y-3">
            <h3 className="text-h3 font-serif text-text-secondary">Hover to see elevation change</h3>
            <div className="flex flex-wrap gap-6">
              <div className="card-grain w-40 h-28 rounded-xl bg-base-800 shadow-elevation-sm hover:shadow-elevation-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center justify-center">
                <span className="text-text-muted text-sm">sm → md</span>
              </div>
              <div className="card-grain w-40 h-28 rounded-xl bg-base-800 shadow-elevation-md hover:shadow-elevation-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer flex items-center justify-center">
                <span className="text-text-muted text-sm">md → lg</span>
              </div>
              <div className="card-grain w-40 h-28 rounded-xl bg-base-700 shadow-elevation-sm hover:shadow-elevation-lg hover:-translate-y-3 transition-all duration-300 cursor-pointer flex items-center justify-center">
                <span className="text-text-muted text-sm">sm → lg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Button Variations */}
        <div className="space-y-8 py-8 border-t border-base-700">
          <h2 className="text-h2 font-serif">Button Variations</h2>

          {/* Primary Buttons */}
          <div className="space-y-3">
            <h3 className="text-h3 font-serif text-text-secondary">Primary (CTA)</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <button className="px-4 py-2 text-sm bg-amber-500 text-base-950 rounded-xl shadow-md font-medium hover:bg-amber-400 transition-colors cursor-pointer">
                A. Solid Amber
              </button>
              <button className="px-4 py-2 text-sm bg-amber-500 text-base-950 rounded-xl font-medium hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25 transition-all cursor-pointer">
                B. Amber + Glow
              </button>
              <button className="px-4 py-2 text-sm bg-gradient-to-r from-amber-500 to-amber-400 text-base-950 rounded-xl shadow-md font-medium hover:from-amber-400 hover:to-amber-300 transition-all cursor-pointer">
                C. Gradient Amber
              </button>
              <button className="px-4 py-2 text-sm bg-amber-500/90 text-base-950 rounded-xl font-medium hover:bg-amber-500 hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer">
                D. Amber + Lift
              </button>
            </div>
          </div>

          {/* Outline Buttons */}
          <div className="space-y-3">
            <h3 className="text-h3 font-serif text-text-secondary">Outline / Ghost</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <button className="px-4 py-2 text-sm border-2 border-amber-500 text-amber-500 rounded-xl font-medium hover:bg-amber-500 hover:text-base-950 transition-colors cursor-pointer">
                E. Amber Outline
              </button>
              <button className="px-4 py-2 text-sm border border-amber-500/50 text-amber-400 rounded-xl font-medium hover:border-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer">
                F. Subtle Outline
              </button>
              <button className="px-4 py-2 text-sm text-amber-400 rounded-xl font-medium hover:bg-amber-500/10 transition-colors cursor-pointer">
                G. Ghost Amber
              </button>
              <button className="px-4 py-2 text-sm border border-base-600 text-text-primary rounded-xl font-medium hover:border-base-500 hover:bg-base-800 transition-colors cursor-pointer">
                H. Ghost Slate
              </button>
            </div>
          </div>

          {/* Secondary Buttons */}
          <div className="space-y-3">
            <h3 className="text-h3 font-serif text-text-secondary">Secondary</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <button className="px-4 py-2 text-sm bg-base-700 text-text-primary rounded-xl shadow-sm font-medium hover:bg-base-600 transition-colors cursor-pointer">
                I. Solid Slate
              </button>
              <button className="px-4 py-2 text-sm bg-base-800 text-text-primary rounded-xl font-medium hover:bg-base-700 transition-colors cursor-pointer">
                J. Soft Slate
              </button>
              <button className="px-4 py-2 text-sm bg-base-800/50 backdrop-blur text-text-primary rounded-xl font-medium hover:bg-base-700/50 transition-colors cursor-pointer">
                K. Glass Slate
              </button>
              <button className="px-4 py-2 text-sm bg-amber-500/15 text-amber-400 rounded-xl font-medium hover:bg-amber-500/25 transition-colors cursor-pointer">
                L. Soft Amber
              </button>
            </div>
          </div>

          {/* Text Links */}
          <div className="space-y-3">
            <h3 className="text-h3 font-serif text-text-secondary">Text Links</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <a href="#" className="text-amber-400 hover:text-amber-300 underline underline-offset-4 font-medium">
                M. Underlined
              </a>
              <a href="#" className="text-amber-400 hover:text-amber-300 font-medium hover:underline underline-offset-4">
                N. Hover Underline
              </a>
              <a href="#" className="text-text-primary hover:text-amber-400 font-medium transition-colors">
                O. Color Shift
              </a>
              <a href="#" className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 group">
                P. With Arrow <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Pill Shapes */}
          <div className="space-y-3">
            <h3 className="text-h3 font-serif text-text-secondary">Pill Shape</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <button className="px-4 py-2 text-sm bg-amber-500 text-base-950 rounded-full shadow-md font-medium hover:bg-amber-400 transition-colors cursor-pointer">
                Q. Pill Solid
              </button>
              <button className="px-4 py-2 text-sm border-2 border-amber-500 text-amber-500 rounded-full font-medium hover:bg-amber-500 hover:text-base-950 transition-colors cursor-pointer">
                R. Pill Outline
              </button>
            </div>
          </div>

          {/* Size Variations */}
          <div className="space-y-3">
            <h3 className="text-h3 font-serif text-text-secondary">Size Variations</h3>

            {/* Primary sizes */}
            <div className="flex flex-wrap gap-4 items-center">
              <button className="px-4 py-2 text-sm bg-amber-500 text-base-950 rounded-xl font-medium hover:bg-amber-400 transition-colors cursor-pointer">
                Small (Default)
              </button>
              <button className="px-6 py-2.5 bg-amber-500 text-base-950 rounded-xl font-medium hover:bg-amber-400 transition-colors cursor-pointer">
                Medium
              </button>
              <button className="px-8 py-3 text-lg bg-amber-500 text-base-950 rounded-xl font-medium hover:bg-amber-400 transition-colors cursor-pointer">
                Large
              </button>
              <button className="px-10 py-3.5 text-xl bg-amber-500 text-base-950 rounded-2xl font-medium hover:bg-amber-400 transition-colors cursor-pointer">
                Extra Large
              </button>
            </div>

            {/* Secondary sizes */}
            <div className="flex flex-wrap gap-4 items-center mt-4">
              <button className="px-4 py-2 text-sm bg-base-700 text-text-primary rounded-xl font-medium hover:bg-base-600 transition-colors cursor-pointer">
                Small (Default)
              </button>
              <button className="px-6 py-2.5 bg-base-700 text-text-primary rounded-xl font-medium hover:bg-base-600 transition-colors cursor-pointer">
                Medium
              </button>
              <button className="px-8 py-3 text-lg bg-base-700 text-text-primary rounded-xl font-medium hover:bg-base-600 transition-colors cursor-pointer">
                Large
              </button>
              <button className="px-10 py-3.5 text-xl bg-base-700 text-text-primary rounded-2xl font-medium hover:bg-base-600 transition-colors cursor-pointer">
                Extra Large
              </button>
            </div>

            {/* Outline sizes */}
            <div className="flex flex-wrap gap-4 items-center mt-4">
              <button className="px-4 py-2 text-sm border-2 border-amber-500 text-amber-500 rounded-xl font-medium hover:bg-amber-500 hover:text-base-950 transition-colors cursor-pointer">
                Small (Default)
              </button>
              <button className="px-6 py-2.5 border-2 border-amber-500 text-amber-500 rounded-xl font-medium hover:bg-amber-500 hover:text-base-950 transition-colors cursor-pointer">
                Medium
              </button>
              <button className="px-8 py-3 text-lg border-2 border-amber-500 text-amber-500 rounded-xl font-medium hover:bg-amber-500 hover:text-base-950 transition-colors cursor-pointer">
                Large
              </button>
              <button className="px-10 py-3.5 text-xl border-2 border-amber-500 text-amber-500 rounded-2xl font-medium hover:bg-amber-500 hover:text-base-950 transition-colors cursor-pointer">
                Extra Large
              </button>
            </div>
          </div>
        </div>

        {/* Responsive test section */}
        <section id="responsive" className="py-8 border-t border-base-700">
          <h2 className="text-h2 font-serif mb-6">Responsive Test</h2>

          {/* Container query demo */}
          <div className="@container">
            <div className="@sm:flex @sm:gap-8 space-y-4 @sm:space-y-0">
              <div className="card-grain flex-1 p-6 bg-base-800 rounded-lg shadow-md">
                <h3 className="text-h3 font-serif mb-2">Card One</h3>
                <p className="text-body text-text-secondary">
                  This card responds to container width, not viewport.
                </p>
              </div>
              <div className="card-grain flex-1 p-6 bg-base-800 rounded-lg shadow-md">
                <h3 className="text-h3 font-serif mb-2">Card Two</h3>
                <p className="text-body text-text-secondary">
                  At narrow widths, cards stack. At wider widths, they sit side by side.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive test section */}
        <section id="interactive" className="py-8 border-t border-base-700">
          <h2 className="text-h2 font-serif mb-6">Interactive Test</h2>
          <p className="text-body text-text-secondary mb-4">
            Click these buttons to verify grain overlay does not block interactions:
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              className="px-4 py-2 text-sm bg-amber-500 text-base-950 rounded-xl shadow-md font-medium hover:bg-amber-400 transition-colors cursor-pointer"
              onClick={() => alert('Primary button works!')}
            >
              Primary Action
            </button>
            <button
              className="px-4 py-2 text-sm bg-base-700 text-text-primary rounded-xl shadow-sm hover:bg-base-600 transition-colors cursor-pointer"
              onClick={() => alert('Secondary button works!')}
            >
              Secondary Action
            </button>
            <a
              href="#top"
              className="px-4 py-2 text-sm text-amber-400 hover:text-amber-300 underline underline-offset-4"
            >
              Link Element
            </a>
          </div>
        </section>
      </section>

      {/* Viewport indicator for testing */}
      <div className="fixed bottom-4 right-4 px-3 py-1 bg-base-800/90 rounded text-small text-text-muted">
        <span className="sm:hidden">XS (&lt;640)</span>
        <span className="hidden sm:inline md:hidden">SM (640-767)</span>
        <span className="hidden md:inline lg:hidden">MD (768-1023)</span>
        <span className="hidden lg:inline xl:hidden">LG (1024-1279)</span>
        <span className="hidden xl:inline">XL (1280+)</span>
      </div>
    </main>
  )
}
