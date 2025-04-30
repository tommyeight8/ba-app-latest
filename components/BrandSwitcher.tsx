"use client";

import { useBrand } from "@/context/BrandContext";

export function BrandSwitcher() {
  const { brand, setBrand } = useBrand();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as "litto" | "skwezed";
    setBrand(selected);
  };

  return (
    <select
      value={brand}
      onChange={handleChange}
      className="border px-3 py-2 rounded-md"
    >
      <option value="litto" className="text-black">
        Litto
      </option>
      <option value="skwezed" className="text-black">
        Skwezed
      </option>
    </select>
  );
}
