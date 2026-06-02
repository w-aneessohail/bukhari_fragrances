import { prisma } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";

type AddressInput = {
  label: string;
  street: string;
  area: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
};

function mapAddress(address: {
  id: string;
  label: string;
  street: string;
  area: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: Date;
}) {
  return {
    id: address.id,
    label: address.label,
    street: address.street,
    area: address.area,
    city: address.city,
    province: address.province,
    postalCode: address.postalCode,
    isDefault: address.isDefault,
    createdAt: address.createdAt.toISOString()
  };
}

export async function listAddresses(userId: string) {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });

  return addresses.map(mapAddress);
}

export async function createAddress(userId: string, input: AddressInput) {
  if (input.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }

  const hasDefault = await prisma.address.findFirst({ where: { userId, isDefault: true } });
  const address = await prisma.address.create({
    data: {
      userId,
      label: input.label,
      street: input.street,
      area: input.area,
      city: input.city,
      province: input.province,
      postalCode: input.postalCode,
      isDefault: input.isDefault ?? !hasDefault
    }
  });

  return mapAddress(address);
}

export async function updateAddress(userId: string, addressId: string, input: Partial<AddressInput>) {
  const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!existing) {
    throw new HttpError("Address not found", 404);
  }

  if (input.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }

  const address = await prisma.address.update({
    where: { id: addressId },
    data: input
  });

  return mapAddress(address);
}

export async function deleteAddress(userId: string, addressId: string) {
  const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!existing) {
    throw new HttpError("Address not found", 404);
  }

  await prisma.address.delete({ where: { id: addressId } });

  if (existing.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    if (next) {
      await prisma.address.update({
        where: { id: next.id },
        data: { isDefault: true }
      });
    }
  }

  return { deleted: true };
}
