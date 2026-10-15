export default function ProductSkeleton() {
    return (
      <div className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="aspect-square bg-stone-200" />
        <div className="space-y-2 p-4">
          <div className="h-3 w-1/3 rounded bg-stone-200" />
          <div className="h-4 w-2/3 rounded bg-stone-200" />
          <div className="h-5 w-1/4 rounded bg-stone-200" />
        </div>
      </div>
    );
  }