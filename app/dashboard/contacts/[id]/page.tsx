import ContactPageClient from "@/components/ContactPageClient";

type PageProps = {
  params: {
    id: string;
  };
};

export default function ContactPage({ params }: PageProps) {
  return <ContactPageClient id={params.id} />;
}

// import { getContactById } from "@/app/actions/getContactById";
// import { cookies } from "next/headers";
// import { notFound } from "next/navigation";
// import ContactPageClient from "@/components/ContactPageClient"; // update path as needed

// export default async function ContactPage({ params }: { params: { id: string } }) {
//   const cookieStore = await cookies();
//   const brand = (cookieStore.get("selected_brand")?.value ?? "litto") as "litto" | "skwezed";

//   const contact = await getContactById(params.id, brand);

//   if (!contact || !contact.properties) {
//     notFound();
//   }

//   return <ContactPageClient contact={contact} />;
// }
