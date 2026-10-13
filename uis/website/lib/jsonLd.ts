import { company } from "@repo/shared-types";

/** ISO 3166-1 alpha-2 codes for the countries named in @repo/shared-types. */
const COUNTRY_CODES: Readonly<Record<string, string>> = {
  Spain: "ES",
  "United States": "US",
};

function countryCode(country: string): string {
  const code = COUNTRY_CODES[country];
  if (!code) throw new Error(`No ISO country code for "${country}"`);
  return code;
}

/** schema.org Organization for the layout, built only from shared company data. */
export function organizationJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description,
    foundingDate: String(company.foundedYear),
    numberOfEmployees: { "@type": "QuantitativeValue", value: company.employees },
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: company.headquarters.city,
        addressCountry: countryCode(company.headquarters.country),
      },
      ...company.offices.map((o) => ({
        "@type": "PostalAddress",
        addressLocality: o.city,
        addressRegion: o.region,
        addressCountry: countryCode(o.country),
      })),
    ],
  };
}
