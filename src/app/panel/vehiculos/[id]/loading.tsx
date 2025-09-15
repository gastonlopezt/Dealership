export default function Loading() {
  return (
    <main>
      <div className="animate-pulse">
        <div className="h-7 w-48 rounded bg-gray-200" />
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="grid max-w-xl gap-3">
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-24 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 w-32 rounded bg-gray-200" />
          </div>
          <aside>
            <div className="card p-4">
              <div className="mb-3 h-6 w-28 rounded bg-gray-200" />
              <div className="mb-4 aspect-video w-full rounded bg-gray-200" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <div className="h-28 rounded bg-gray-200" />
                <div className="h-28 rounded bg-gray-200" />
                <div className="h-28 rounded bg-gray-200" />
                <div className="h-28 rounded bg-gray-200" />
                <div className="h-28 rounded bg-gray-200" />
                <div className="h-28 rounded bg-gray-200" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
