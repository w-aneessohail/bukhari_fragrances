import PageMeta from "../../components/seo/PageMeta";
import JsonLd from "../../components/seo/JsonLd";
import ScentFinderSection from "../../components/home/ScentFinderSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import NewsletterSection from "../../components/home/NewsletterSection";
import ModernHero from "../../components/home/modern/ModernHero";
import ModernEditorialRail from "../../components/home/modern/ModernEditorialRail";
import ModernBento from "../../components/home/modern/ModernBento";
import ModernFragranceLayers from "../../components/home/modern/ModernFragranceLayers";
import ModernProductRail from "../../components/home/modern/ModernProductRail";
import { HOME_ROUTES } from "../../constants/homePages";
import { buildOrganizationJsonLd } from "../../utils/jsonLd";

export default function ModernHome() {
  return (
    <div className="modern-home">
      <PageMeta
        title="Bukhari Perfumes — Modern Luxury Fragrances"
        description="A lighter, editorial take on Bukhari Perfumes — heritage storytelling, curated bestsellers, and scent discovery from Lahore."
        path={HOME_ROUTES.modern}
      />
      <JsonLd data={buildOrganizationJsonLd()} />
      <ModernHero />
      <ModernEditorialRail />
      <ModernBento />
      <ModernFragranceLayers />
      <ModernProductRail />
      <TestimonialsSection tone="experience" />
      <div id="scent-finder">
        <ScentFinderSection tone="experience" />
      </div>
      <NewsletterSection tone="experience" />
    </div>
  );
}
