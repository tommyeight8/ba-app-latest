import { Skeleton } from "@/components/ui/skeleton";

export function EditContactSkeleton() {
  return (
    <div className="grid gap-3 py-2">
      {/* Form fields (StoreName, email, etc.) */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="grid gap-1">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-9 w-full rounded-md" /> {/* Input */}
        </div>
      ))}

      {/* Update button */}
      <Skeleton className="h-9 w-full mx-auto mt-2 rounded-md" />

      {/* L2 Status block */}
      <div className="space-y-2 text-center p-4 border rounded-lg mt-4">
        <Skeleton className="h-4 w-32 mx-auto" /> {/* Status label */}
        <div className="flex justify-center gap-6 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* View Contact link */}
      <Skeleton className="h-4 w-40 mx-auto mt-6" />
    </div>
  );
}
