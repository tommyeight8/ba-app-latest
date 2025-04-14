export type HubSpotContact = {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    [key: string]: any;
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
