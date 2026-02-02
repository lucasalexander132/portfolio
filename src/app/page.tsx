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
        <div className="space-y-4 py-8 border-t border-base-700">
          <h2 className="text-h2 font-serif">Shadow System</h2>
          <div className="flex flex-wrap gap-8">
            <div className="w-32 h-32 rounded-lg bg-base-800 shadow-sm flex items-center justify-center text-text-muted">sm</div>
            <div className="w-32 h-32 rounded-lg bg-base-800 shadow-md flex items-center justify-center text-text-muted">md</div>
            <div className="w-32 h-32 rounded-lg bg-base-800 shadow-lg flex items-center justify-center text-text-muted">lg</div>
          </div>
        </div>

        {/* CTA example */}
        <div className="space-y-4 py-8 border-t border-base-700">
          <h2 className="text-h2 font-serif">Accent Usage</h2>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-base-950 rounded-md shadow-md font-medium">
            Start a Conversation
          </div>
        </div>

        {/* Responsive test section */}
        <section id="responsive" className="py-8 border-t border-base-700">
          <h2 className="text-h2 font-serif mb-6">Responsive Test</h2>

          {/* Container query demo */}
          <div className="@container">
            <div className="@sm:flex @sm:gap-8 space-y-4 @sm:space-y-0">
              <div className="flex-1 p-6 bg-base-800 rounded-lg shadow-md">
                <h3 className="text-h3 font-serif mb-2">Card One</h3>
                <p className="text-body text-text-secondary">
                  This card responds to container width, not viewport.
                </p>
              </div>
              <div className="flex-1 p-6 bg-base-800 rounded-lg shadow-md">
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
              className="px-6 py-3 bg-amber-500 text-base-950 rounded-md shadow-md font-medium hover:bg-amber-400 transition-colors cursor-pointer"
              onClick={() => alert('Primary button works!')}
            >
              Primary Action
            </button>
            <button
              className="px-6 py-3 bg-base-700 text-text-primary rounded-md shadow-sm hover:bg-base-600 transition-colors cursor-pointer"
              onClick={() => alert('Secondary button works!')}
            >
              Secondary Action
            </button>
            <a
              href="#top"
              className="px-6 py-3 text-amber-400 hover:text-amber-300 underline underline-offset-4"
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
