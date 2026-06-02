import { api } from "./api";

export type Address = {
  id: string;
  label: string;
  street: string;
  area: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
};

export type AddressInput = Omit<Address, "id" | "createdAt" | "isDefault"> & {
  isDefault?: boolean;
};

export async function fetchAddresses() {
  const response = await api.get<{ data: Address[] }>("/users/addresses");
  return response.data.data;
}

export async function createAddress(input: AddressInput) {
  const response = await api.post<{ data: Address }>("/users/addresses", input);
  return response.data.data;
}

export async function deleteAddress(addressId: string) {
  await api.delete(`/users/addresses/${addressId}`);
}

export async function changePassword(currentPassword: string, newPassword: string) {
  await api.post("/users/change-password", { currentPassword, newPassword });
}
