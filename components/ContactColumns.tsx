import { ColumnDef } from "@tanstack/react-table";
import { HubSpotContact } from "@/types/hubspot";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import { useContactEdit } from "@/context/ContactEditContext";

export const contactColumns: ColumnDef<HubSpotContact>[] = [
  {
    accessorKey: "properties.firstname",
    header: "First Name",
    cell: ({ row }) => row.original.properties.firstname ?? "-",
  },
  {
    accessorKey: "properties.lastname",
    header: "Last Name",
    cell: ({ row }) => row.original.properties.lastname ?? "-",
  },
  {
    accessorKey: "properties.email",
    header: "Email",
    cell: ({ row }) => row.original.properties.email ?? "-",
  },
  {
    accessorKey: "properties.company",
    header: "Store",
    cell: ({ row }) => row.original.properties.company ?? "-",
  },
  {
    accessorKey: "properties.phone",
    header: "Phone",
    cell: ({ row }) => row.original.properties.phone ?? "-",
  },
  {
    accessorKey: "properties.zip",
    header: "Postal Code",
    cell: ({ row }) => row.original.properties.zip ?? "-",
  },
  {
    accessorKey: "properties.address",
    header: "Street Address",
    cell: ({ row }) => row.original.properties.address ?? "-",
  },
  {
    accessorKey: "properties.city",
    header: "City",
    cell: ({ row }) => row.original.properties.city ?? "-",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const contact = row.original;
      const { setContact, setOpen } = useContactEdit();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setContact(contact);
                setOpen(true);
              }}
            >
              Edit Contact
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => console.log("Delete", contact)}
            >
              Delete Contact
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => console.log("View", contact)}
            >
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
