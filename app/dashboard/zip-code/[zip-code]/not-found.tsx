// app/zip/[zip-code]/not-found.tsx
export default function NotFound() {
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">No contacts found</h2>
      <p className="text-muted-foreground mt-2">Try a different zip code...</p>
    </div>
  );
}
