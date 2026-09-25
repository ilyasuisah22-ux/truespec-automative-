export default function SiteLoading() {
  return (
    <div className="container-page py-20" role="status" aria-live="polite">
      <span className="sr-only">Loading content…</span>
      <div className="animate-pulse space-y-6" aria-hidden>
        <div className="h-8 w-64 rounded-md bg-graphite-800" />
        <div className="h-4 w-full max-w-md rounded-md bg-graphite-850" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-graphite-800">
              <div className="aspect-[3/2] w-full bg-graphite-850" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-40 rounded bg-graphite-800" />
                <div className="h-3 w-24 rounded bg-graphite-850" />
                <div className="h-6 w-32 rounded bg-graphite-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
