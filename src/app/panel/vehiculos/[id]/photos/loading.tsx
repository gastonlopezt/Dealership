export default function Loading() {
  return (
    <main>
      <div className="animate-pulse">
        <div className="mb-4 h-7 w-32 rounded bg-gray-200" />
        <div className="mb-3 h-10 w-64 rounded bg-gray-200" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 rounded bg-gray-200" />
          ))}
        </div>
      </div>
    </main>
  );
}
