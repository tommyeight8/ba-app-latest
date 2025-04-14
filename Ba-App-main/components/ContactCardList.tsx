import { ContactCard } from "./ContactCard"; // path to the component
import { HubSpotContact } from "@/types/hubspot";

export function ContactCardGrid({ contacts }: { contacts: HubSpotContact[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
