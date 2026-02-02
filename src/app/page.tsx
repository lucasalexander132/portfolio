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
      </section>
    </main>
  )
}
