import { Helmet } from "react-helmet-async";

type PageMetaProps = {
  title: string;
  description?: string;
  image?: string;
  path?: string;
};

const SITE_NAME = "Bukhari Perfumes";
const DEFAULT_DESCRIPTION =
  "Luxury fragrances crafted in Lahore. Discover oud, attar, and signature scents from Bukhari Perfumes.";

export default function PageMeta({ title, description = DEFAULT_DESCRIPTION, image, path = "" }: PageMetaProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const origin = typeof window !== "undefined" ? window.location.origin : "https://bukhariperfumes.com";
  const url = `${origin}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      {image ? <meta property="og:image" content={image} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
