"use client";

import { Button } from "@/components/ui/button";

export function PaginationControls({
  page,
  pageCount,
  onNext,
  onPrev,
  hasNext = true,
}: {
  page: number;
  pageCount?: number;
  onNext: () => void;
  onPrev: () => void;
  hasNext?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-4">
      <Button onClick={onPrev} disabled={page <= 1} variant="outline" size="sm">
        Previous
      </Button>

      {pageCount && pageCount >= page ? (
        <span className="text-sm text-muted-foreground">Page {page}</span>
      ) : (
        <span className="text-sm text-muted-foreground">Page {page}</span>
      )}

      <Button onClick={onNext} disabled={!hasNext} variant="outline" size="sm">
        Next
      </Button>
    </div>
  );
}
