export function getHubspotCredentials(brand: "litto" | "skwezed") {
  if (brand === "litto") {
    return {
      baseUrl: process.env.LITTO_HUBSPOT_API_BASE!,
      token: process.env.LITTO_HUBSPOT_ACCESS_TOKEN!,
    };
  } else if (brand === "skwezed") {
    return {
      baseUrl: process.env.SKWEZED_HUBSPOT_API_BASE!,
      token: process.env.SKWEZED_HUBSPOT_ACCESS_TOKEN!,
    };
  } else {
    throw new Error(`❌ Invalid brand: ${brand}`);
  }
}
