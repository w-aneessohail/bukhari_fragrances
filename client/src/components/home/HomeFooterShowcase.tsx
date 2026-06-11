import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchBestsellerProducts } from "../../services/productService";

const FALLBACK_PRODUCTS = [
  {
    slug: "aqua-souk",
    name: "Aqua Souk",
    scentFamily: "Aquatic",
    price: 4600,
    salePrice: null as number | null,
    mainImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80"
  },
  {
    slug: "rosewood-attar",
    name: "Rosewood Attar",
    scentFamily: "Chypre",
    price: 4700,
    salePrice: null,
    mainImage: "https://images.unsplash.com/photo-1541643600912-78b084683601?auto=format&fit=crop&w=400&q=80"
  },
  {
    slug: "bukhari-oud-royale",
    name: "Bukhari Oud Royale",
    scentFamily: "Oud",
    price: 8900,
    salePrice: 7900,
    mainImage: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=400&q=80"
  },
  {
    slug: "signature-eau",
    name: "Signature Eau",
    scentFamily: "Floral",
    price: 5200,
    salePrice: null,
    mainImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80"
  },
  {
    slug: "niche-noir",
    name: "Niche Noir",
    scentFamily: "Woody",
    price: 6100,
    salePrice: null,
    mainImage: "https://images.unsplash.com/photo-1591375372226-3531cf2bdf4f?auto=format&fit=crop&w=400&q=80"
  }
];

function formatPrice(amount: number) {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

type ShowcaseProduct = {
  slug: string;
  name: string;
  scentFamily?: string;
  price: number;
  salePrice: number | null;
  mainImage: string | null;
};

function ProductCard({ product }: { product: ShowcaseProduct }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="footer-showcase-card group relative mx-3 block w-44 shrink-0 md:mx-4 md:w-52"
    >
      <div className="overflow-hidden border border-white/10 bg-black/40 transition-all duration-300 group-hover:z-10 group-hover:scale-110 group-hover:border-[#D4AF37]/50 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        {product.mainImage ? (
          <img
            src={product.mainImage}
            alt={product.name}
            className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-48"
          />
        ) : (
          <div className="flex h-40 items-center justify-center bg-white/5 md:h-48">
            <span className="text-[10px] uppercase tracking-widest text-white/30">Bukhari</span>
          </div>
        )}
        <div className="p-3 md:p-4">
          <p className="font-serif text-sm text-white md:text-base">{product.name}</p>
          {product.scentFamily ? (
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
              {product.scentFamily}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-[#D4AF37] md:text-sm">
            {formatPrice(product.salePrice ?? product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function HomeFooterShowcase() {
  const { data: products = [] } = useQuery({
    queryKey: ["footer-showcase-products"],
    queryFn: fetchBestsellerProducts,
    staleTime: 60_000
  });

  const items: ShowcaseProduct[] =
    products.length > 0
      ? products.slice(0, 8).map((p) => ({
          slug: p.slug,
          name: p.name,
          scentFamily: p.scentFamily,
          price: p.price,
          salePrice: p.salePrice,
          mainImage: p.mainImage
        }))
      : FALLBACK_PRODUCTS;

  const track = [...items, ...items];

  return (
    <section className="relative overflow-hidden border-t border-white/10 py-10 md:py-14">
      <div className="mb-6 px-6 text-center md:px-12">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/80">Discover</p>
        <h3 className="mt-2 font-serif text-2xl text-white md:text-3xl">Our finest creations</h3>
      </div>

      <div className="footer-showcase-track group/track relative">
        <div className="footer-showcase-marquee flex w-max">
          {track.map((product, index) => (
            <ProductCard key={`${product.slug}-${index}`} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

