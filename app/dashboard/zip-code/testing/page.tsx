import { searchContactsByPostalCode } from "@/app/actions/actions";
import { HubSpotContact } from "@/types/hubspot";

export default async function TestSearchPage() {
  const zip = "90013"; // ✅ your test zip code
  const brand = "litto"; // or "litto"

  const { results, paging } = await searchContactsByPostalCode(
    zip,
    "",
    50,
    brand
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Testing searchContactsByPostalCode
      </h1>
      {results.length === 0 ? (
        <p>No contacts found for zip: {zip}</p>
      ) : (
        <ul className="space-y-2">
          {results.map((contact: HubSpotContact) => (
            <li key={contact.id} className="border p-4 rounded">
              <p>
                <strong>{contact.properties.company}</strong>
              </p>
              <p>{contact.properties.email}</p>
              <p>{contact.properties.zip}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
