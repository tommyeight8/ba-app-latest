import { fetchAllContactFields } from "@/app/actions/actions";
import { HubSpotProperty } from "@/types/hubspot";

export default async function Page() {
  const result = await fetchAllContactFields(); // ✅ Make sure this is correct

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  result.fields.forEach(({ name, label }: HubSpotProperty) => {
    console.log(`${name} (${label})`);
  });

  return (
    <div>
      <h2>HubSpot Fields</h2>
      <ul className="flex flex-col gap-2">
        {result.fields.map((field: HubSpotProperty) => (
          <li key={field.name} className="p-2 border border-gray-200">
            <strong>{field.label}</strong> – <code>{field.name}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
