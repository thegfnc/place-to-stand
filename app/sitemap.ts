import type { MetadataRoute } from "next";

const sections = ["home", "about", "services", "how-we-work", "team", "work", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.placetostand.agency";
  const lastModified = new Date();

  return sections.map((section) => ({
    url: `${baseUrl}/#${section}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6
  }));
}
