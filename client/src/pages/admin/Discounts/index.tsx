import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminDiscount,
  deleteAdminDiscount,
  fetchAdminDiscounts,
  updateAdminDiscount,
  type AdminDiscount,
  type DiscountInput
} from "../../../services/adminDiscountService";

const emptyForm: DiscountInput = {
  code: "",
  type: "PERCENTAGE",
  value: 10,
  minOrder: null,
  maxUses: null,
  expiresAt: null,
  isActive: true
};

function formatType(type: AdminDiscount["type"]) {
  return type.replace(/_/g, " ").toLowerCase();
}

export default function AdminDiscountsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<DiscountInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: discounts = [], isLoading } = useQuery({
    queryKey: ["admin-discounts"],
    queryFn: fetchAdminDiscounts
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });

  const createMutation = useMutation({
    mutationFn: createAdminDiscount,
    onSuccess: () => {
      invalidate();
      setForm(emptyForm);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<DiscountInput> }) =>
      updateAdminDiscount(id, input),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminDiscount,
    onSuccess: invalidate
  });

  const startEdit = (discount: AdminDiscount) => {
    setEditingId(discount.id);
    setForm({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      minOrder: discount.minOrder,
      maxUses: discount.maxUses,
      expiresAt: discount.expiresAt,
      isActive: discount.isActive
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, input: form });
    } else {
      await createMutation.mutateAsync(form);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-accent-gold">Discount codes</h1>
      <p className="mt-2 text-text-secondary">Create and manage promotional codes for checkout.</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-xl border border-border bg-card p-6 md:grid-cols-2">
        <label className="block text-sm">
          <span className="text-text-secondary">Code</span>
          <input
            required
            value={form.code}
            onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2 uppercase"
          />
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Type</span>
          <select
            value={form.type}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                type: event.target.value as DiscountInput["type"]
              }))
            }
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED_AMOUNT">Fixed amount</option>
            <option value="FREE_SHIPPING">Free shipping</option>
          </select>
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Value</span>
          <input
            type="number"
            min={0}
            required
            value={form.value}
            onChange={(event) => setForm((current) => ({ ...current, value: Number(event.target.value) }))}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Minimum order (optional)</span>
          <input
            type="number"
            min={0}
            value={form.minOrder ?? ""}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                minOrder: event.target.value ? Number(event.target.value) : null
              }))
            }
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Max uses (optional)</span>
          <input
            type="number"
            min={1}
            value={form.maxUses ?? ""}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                maxUses: event.target.value ? Number(event.target.value) : null
              }))
            }
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive ?? true}
            onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
          />
          Active
        </label>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-bg-primary disabled:opacity-50"
          >
            {editingId ? "Update discount" : "Create discount"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-bg-secondary text-left text-text-secondary">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Uses</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-secondary">
                  Loading…
                </td>
              </tr>
            ) : discounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-secondary">
                  No discount codes yet.
                </td>
              </tr>
            ) : (
              discounts.map((discount) => (
                <tr key={discount.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{discount.code}</td>
                  <td className="px-4 py-3 capitalize">{formatType(discount.type)}</td>
                  <td className="px-4 py-3">
                    {discount.type === "PERCENTAGE"
                      ? `${discount.value}%`
                      : discount.type === "FREE_SHIPPING"
                        ? "Free shipping"
                        : `Rs. ${discount.value.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3">
                    {discount.usedCount}
                    {discount.maxUses ? ` / ${discount.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <span className={discount.isActive ? "text-green-500" : "text-text-secondary"}>
                      {discount.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(discount)}
                        className="underline hover:text-accent-gold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete ${discount.code}?`)) {
                            deleteMutation.mutate(discount.id);
                          }
                        }}
                        className="text-red-400 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
