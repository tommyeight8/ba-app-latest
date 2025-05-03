"use client";

import { useEffect, useState } from "react";
import { getHubspotOwners } from "@/app/actions/getHubspotOwners";

export function OwnerSelect({
  brand,
  onSelect,
}: {
  brand: "litto" | "skwezed";
  onSelect: (ownerId: string) => void;
}) {
  const [owners, setOwners] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHubspotOwners(brand)
      .then(setOwners)
      .catch((err) => console.error("Failed to load owners", err))
      .finally(() => setLoading(false));
  }, [brand]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Assign to:</label>
      <select
        disabled={loading}
        onChange={(e) => onSelect(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="">Select owner</option>
        {owners.map((owner) => (
          <option key={owner.id} value={owner.id} className="dark:text-black">
            {owner.name}
          </option>
        ))}
      </select>
    </div>
  );
}
