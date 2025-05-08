import ContactPageClient from "@/components/ContactPageClient";

type Params = {
  id: string;
};

type Props = {
  params: Promise<Params>;
};

export default async function ContactPage({ params }: Props) {
  const { id } = await params;
  return <ContactPageClient id={id} />;
}
