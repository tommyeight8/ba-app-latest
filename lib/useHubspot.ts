export type HubSpotContact = {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
  };
};

export async function fetchHubSpotContacts(): Promise<HubSpotContact[] | null> {
  try {
    const response = await fetch("/api/v1/hubspot/contacts");
    const data = await response.json();

    if (data.success) {
      return data.contacts;
    } else {
      console.error("HubSpot API Error:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}
