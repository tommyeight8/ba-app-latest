import ContactPageClient from "@/components/ContactPageClient";

type PageProps = {
  params: {
    id: string;
  };
};

export default function ContactPage({ params }: PageProps) {
  return <ContactPageClient id={params.id} />;
}
