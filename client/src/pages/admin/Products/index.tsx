import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../../services/productService";

function formatLabel(value: string) {
  return value.replace(/_/g, " ");
}

export default function AdminProductsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => fetchProducts({ page: 1, limit: 100 })
  });

  const products = response?.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-3xl text-accent-gold">Products</h1>
      <p className="mt-2 text-text-secondary">Catalog overview — product editing UI coming in a later release.</p>

      {isLoading ? (
        <p className="mt-8 text-text-secondary">Loading products…</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-bg-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border">
                  <td className="px-4 py-3">
                    <Link to={`/product/${product.slug}`} className="font-medium hover:text-accent-gold">
                      {product.name}
                    </Link>
                    <p className="text-xs text-text-secondary">{formatLabel(product.scentFamily)}</p>
                  </td>
                  <td className="px-4 py-3">{product.sku}</td>
                  <td className="px-4 py-3">Rs. {product.price.toLocaleString()}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    {product.isActive ? (
                      <span className="text-accent-gold">Active</span>
                    ) : (
                      <span className="text-text-secondary">Inactive</span>
                    )}
                    {product.isFeatured ? (
                      <span className="ml-2 text-xs text-text-secondary">· Featured</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
