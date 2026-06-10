import PageMeta from "../../components/seo/PageMeta";
import JsonLd from "../../components/seo/JsonLd";
import { buildOrganizationJsonLd } from "../../utils/jsonLd";
import ExperienceHome from "./ExperienceHome";

export default function HomePage() {
  return (
    <>
      <PageMeta
        title="Bukhari Perfumes — Luxury Fragrances from Lahore"
        description="Discover oud, attar, and signature eau de parfum collections handcrafted by Bukhari Perfumes in Lahore."
        path="/"
      />
      <JsonLd data={buildOrganizationJsonLd()} />
      <ExperienceHome />
    </>
  );
}
