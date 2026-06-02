import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  type AddressInput
} from "../../services/userService";

const emptyForm: AddressInput = {
  label: "Home",
  street: "",
  area: "",
  city: "",
  province: "",
  postalCode: ""
};

export default function AddressManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses
  });

  const createMutation = useMutation({
    mutationFn: () => createAddress({ ...form, isDefault: addresses.length === 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setForm(emptyForm);
      setError(null);
    },
    onError: () => setError("Could not save address")
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] })
  });

  const updateField = (field: keyof AddressInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {isLoading ? <p className="text-text-secondary">Loading addresses…</p> : null}

      {addresses.length > 0 ? (
        <ul className="space-y-3">
          {addresses.map((address) => (
            <li key={address.id} className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-text-primary">
                    {address.label}
                    {address.isDefault ? (
                      <span className="ml-2 text-xs text-accent-gold">Default</span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {address.street}, {address.area}
                    <br />
                    {address.city}, {address.province} {address.postalCode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(address.id)}
                  className="text-sm text-text-secondary underline hover:text-accent-gold"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-text-secondary">No saved addresses yet.</p>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          createMutation.mutate();
        }}
        className="space-y-3 border-t border-border pt-6"
      >
        <h3 className="font-heading text-xl text-text-primary">Add address</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["label", "street", "area", "city", "province", "postalCode"] as const).map((field) => (
            <label key={field} className="block text-sm capitalize">
              <span className="text-text-secondary">{field === "postalCode" ? "Postal code" : field}</span>
              <input
                required
                value={form[field]}
                onChange={(event) => updateField(field, event.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
              />
            </label>
          ))}
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-accent-gold px-6 py-2 text-sm font-medium text-bg-primary disabled:opacity-50"
        >
          Save address
        </button>
      </form>
    </div>
  );
}
