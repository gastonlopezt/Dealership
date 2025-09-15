export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="animate-pulse">
        {/* Breadcrumb */}
        <div className="h-4 w-40 rounded bg-gray-200" />

        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {/* Gallery area */}
          <section className="md:col-span-2">
            <div className="aspect-video w-full rounded bg-gray-200" />
            <div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 rounded bg-gray-200" />
              ))}
            </div>
            <div className="mt-6">
              <div className="mb-2 h-6 w-32 rounded bg-gray-200" />
              <div className="h-24 w-full rounded bg-gray-200" />
            </div>
          </section>

          {/* Sticky summary card */}
          <aside className="md:col-span-1">
            <div className="sticky top-24 rounded-xl border p-4 shadow-sm">
              <div className="h-8 w-64 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-40 rounded bg-gray-200" />
              <div className="mt-3 h-8 w-40 rounded bg-gray-200" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="h-10 rounded bg-gray-200" />
                <div className="h-10 rounded bg-gray-200" />
              </div>
              <div className="mt-5 space-y-2">
                <div className="h-10 w-full rounded bg-gray-200" />
                <div className="h-10 w-full rounded bg-gray-200" />
              </div>
              <div className="mt-3 h-3 w-56 rounded bg-gray-200" />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
