import { HubSpotContact } from "@/types/hubspot";
import { ContactCard } from "./ContactCard";

export function ContactsDashboard({
  contacts,
}: {
  contacts: HubSpotContact[];
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">HubSpot Contacts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </div>
  );
}
