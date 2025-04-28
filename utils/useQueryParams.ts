// utils/useQueryParams.ts
import { useSearchParams } from "next/navigation";

export function useQueryParams() {
  const params = useSearchParams();

  return {
    page: parseInt(params.get("page") || "1"),
    query: params.get("query") || "",
    status: params.get("status") || "all",
  };
}
