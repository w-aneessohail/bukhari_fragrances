import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ProductForm from "../../../components/admin/ProductForm";
import ProductImageUpload from "../../../components/admin/ProductImageUpload";
import {
  createAdminProduct,
  deactivateAdminProduct,
  fetchAdminProducts,
  updateAdminProduct,
  type AdminProductInput
} from "../../../services/adminProductService";
import { fetchCategories } from "../../../services/productService";
import type { ProductSummary } from "../../../types/product.types";

function formatLabel(value: string) {
  return value.replace(/_/g, " ");
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductSummary | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => fetchAdminProducts(1, 100)
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-products"] });

  const createMutation = useMutation({
    mutationFn: createAdminProduct,
    onSuccess: () => {
      invalidate();
      setShowCreate(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<AdminProductInput> }) =>
      updateAdminProduct(id, input),
    onSuccess: () => {
      invalidate();
      setEditingProduct(null);
    }
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateAdminProduct,
    onSuccess: () => {
      invalidate();
      setEditingProduct(null);
    }
  });

  const products = response?.data ?? [];

  const handleCreate = async (input: AdminProductInput) => {
    await createMutation.mutateAsync(input);
  };

  const handleUpdate = async (input: AdminProductInput) => {
    if (!editingProduct) return;
    await updateMutation.mutateAsync({ id: editingProduct.id, input });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-accent-gold">Products</h1>
          <p className="mt-2 text-text-secondary">Manage the Bukhari Perfumes catalog.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowCreate((open) => !open);
            setEditingProduct(null);
          }}
          className="rounded-lg bg-accent-gold px-5 py-2 text-sm font-medium text-bg-primary"
        >
          {showCreate ? "Close form" : "Add product"}
        </button>
      </div>

      {showCreate ? (
        <div className="mt-8">
          <h2 className="mb-4 font-heading text-xl text-text-primary">New product</h2>
          <ProductForm
            categories={categories}
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            submitLabel="Create product"
          />
        </div>
      ) : null}

      {editingProduct ? (
        <div className="mt-8">
          <h2 className="mb-4 font-heading text-xl text-text-primary">Edit {editingProduct.name}</h2>
          <ProductImageUpload
            productId={editingProduct.id}
            onUploaded={() => queryClient.invalidateQueries({ queryKey: ["admin-products"] })}
          />

          <ProductForm
            categories={categories}
            initial={{
              name: editingProduct.name,
              description: editingProduct.description,
              price: editingProduct.price,
              salePrice: editingProduct.salePrice,
              stock: editingProduct.stock,
              sku: editingProduct.sku,
              categoryId: editingProduct.category?.id ?? "",
              gender: editingProduct.gender as AdminProductInput["gender"],
              concentration: editingProduct.concentration as AdminProductInput["concentration"],
              scentFamily: editingProduct.scentFamily as AdminProductInput["scentFamily"],
              isActive: editingProduct.isActive,
              isFeatured: editingProduct.isFeatured
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProduct(null)}
            submitLabel="Update product"
          />
          <button
            type="button"
            disabled={deactivateMutation.isPending}
            onClick={() => {
              if (window.confirm(`Deactivate "${editingProduct.name}"? It will be hidden from the shop.`)) {
                deactivateMutation.mutate(editingProduct.id);
              }
            }}
            className="mt-4 text-sm text-red-400 underline"
          >
            Deactivate product
          </button>
        </div>
      ) : null}

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
                <th className="px-4 py-3 font-medium">Actions</th>
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
                  <td className="px-4 py-3">
                    Rs. {(product.salePrice ?? product.price).toLocaleString()}
                    {product.salePrice ? (
                      <span className="block text-xs text-text-secondary line-through">
                        Rs. {product.price.toLocaleString()}
                      </span>
                    ) : null}
                  </td>
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
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(product);
                        setShowCreate(false);
                      }}
                      className="text-accent-gold underline"
                    >
                      Edit
                    </button>
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
