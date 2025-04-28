import { HubSpotContact } from "@/types/hubspot";
import { useContactEdit } from "@/context/ContactEditContext";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function ContactCard({ contact }: { contact: HubSpotContact }) {
  const { setContact, setOpen } = useContactEdit();
  const {
    email,
    phone,
    company,
    city,
    address,
    zip,
    hs_lead_status,
    l2_lead_status,
  } = contact.properties;

  const validL2Statuses = [
    "pending visit",
    "visit requested by rep",
    "dropped off",
  ];
  const showBadge =
    hs_lead_status === "Samples" &&
    validL2Statuses.includes(l2_lead_status ?? "");

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow p-0"
      onClick={() => {
        setContact(contact);
        setOpen(true);
      }}
    >
      <CardContent className="p-4 relative flex flex-col gap-1 h-full">
        <div
          className="flex items-center gap-2 text-lg font-semibold bg-gray-100 dark:bg-[#333]
          dark:text-gray-200 text-black p-2 rounded-t-md"
        >
          <span className="uppercase">{company ?? "-"}</span>
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
        {showBadge && (
          <StatusBadge
            status={contact.properties.l2_lead_status || "unknown"}
          />
        )}
      </CardContent>
    </Card>
  );
}
