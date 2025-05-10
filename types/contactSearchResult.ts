import { HubSpotContact } from "./hubspot";

export type ContactSearchResult = {
  results: HubSpotContact[];
  paging?: {
    next?: {
      after: string;
    };
  };
};
