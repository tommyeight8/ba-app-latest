export type HubSpotContact = {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    company?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    jobtitle?: string;
    hs_lead_status?: string;
    l2_lead_status?: string;
    [key: string]: any; // Keep fallback for dynamic properties
  };
};

export type HubSpotContactResult =
  | { success: true; contacts: HubSpotContact[] }
  | { success: false; error: string };

export type HubSpotProperty = {
  name: string;
  label: string;
  type: string;
  fieldType: string;
  groupName: string;
  description: string;
};

export type HubSpotFieldsResult =
  | { success: true; fields: HubSpotProperty[] }
  | { success: false; error: string };
