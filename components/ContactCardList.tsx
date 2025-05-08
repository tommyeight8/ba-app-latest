import { ContactCard } from "./ContactCard";
import { useContactContext } from "@/context/ContactContext";

export function ContactCardGrid() {
  const { contacts } = useContactContext(); // 🔥 read directly from context

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} href={contact.id} />
      ))}
    </div>
  );
}

// import { ContactCard } from "./ContactCard"; // path to the component
// import { HubSpotContact } from "@/types/hubspot";

// export function ContactCardGrid({ contacts }: { contacts: HubSpotContact[] }) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//       {contacts.map((contact) => (
//         <ContactCard
//           key={`${contact.id}-${contact.properties.l2_lead_status}`}
//           contact={contact}
//           href={contact.id}
//         />
//       ))}
//     </div>
//   );
// }
