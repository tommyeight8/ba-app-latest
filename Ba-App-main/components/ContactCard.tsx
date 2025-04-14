import { HubSpotContact } from "@/types/hubspot";
import { useContactEdit } from "@/context/ContactEditContext";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Building2, MapPin, User2 } from "lucide-react";

export function ContactCard({ contact }: { contact: HubSpotContact }) {
  const { setContact, setOpen } = useContactEdit();
  const { firstname, lastname, email, phone, company, city, address, zip } =
    contact.properties;

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow p-0"
      onClick={() => {
        setContact(contact);
        setOpen(true);
      }}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-lg font-semibold bg-gray-100 text-black p-2 rounded-t-md">
          <span>{company ?? "-"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span>{email ?? "-"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{phone ?? "-"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>
            {address ?? "-"}, {city ?? "-"} {zip ?? "-"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { HubSpotContact } from "@/types/hubspot";

// export function ContactCard({ contact }: { contact: HubSpotContact }) {
//   const { firstname, lastname, email, company, address, city, state, zip } =
//     contact.properties;

//   return (
//     <Card className="w-full max-w-sm">
//       <CardHeader>
//         <CardTitle className="text-lg font-semibold">
//           {firstname ?? "First"} {lastname ?? "Last"}
//         </CardTitle>
//         <p className="text-sm text-muted-foreground">{email ?? "No email"}</p>
//       </CardHeader>
//       <CardContent className="text-sm space-y-1">
//         {company && (
//           <p>
//             <span className="font-medium">Company:</span> {company}
//           </p>
//         )}
//         <p>
//           <span className="font-medium">Address:</span>{" "}
//           {[address, city, state, zip].filter(Boolean).join(", ") || "N/A"}
//         </p>
//       </CardContent>
//     </Card>
//   );
// }
