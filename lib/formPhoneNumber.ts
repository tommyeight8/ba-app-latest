// lib/formatPhone.ts
export function formatPhoneNumber(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 10); // max 10 digits

  const area = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const line = digits.slice(6, 10);

  if (digits.length < 4) return area;
  if (digits.length < 7) return `${area}-${prefix}`;
  return `${area}-${prefix}-${line}`;
}
