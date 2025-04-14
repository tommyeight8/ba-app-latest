// components/SubmitButton.tsx
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SubmitButton({
  loading,
  children,
  className = "",
}: {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      type="submit"
      className={`w-full bg-gray-100 text-black hover:bg-gray-300 ${className}`}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin w-4 h-4" />
          Loading...
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
