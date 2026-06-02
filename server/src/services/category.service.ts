import { prisma } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { slugify } from "../utils/product.utils.js";

type CreateCategoryInput = {
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
};

type UpdateCategoryInput = Partial<CreateCategoryInput>;

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {})
      }
    });

    if (!existing) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      children: true,
      _count: { select: { products: true } }
    },
    orderBy: { name: "asc" }
  });

  return categories;
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: true,
      _count: { select: { products: true } }
    }
  });

  if (!category) {
    throw new HttpError("Category not found", 404);
  }

  return category;
}

export async function createCategory(input: CreateCategoryInput) {
  const baseSlug = slugify(input.slug ?? input.name);
  const slug = await ensureUniqueSlug(baseSlug);

  if (input.parentId) {
    const parent = await prisma.category.findUnique({ where: { id: input.parentId } });
    if (!parent) {
      throw new HttpError("Parent category not found", 404);
    }
  }

  return prisma.category.create({
    data: {
      name: input.name,
      slug,
      description: input.description ?? null,
      image: input.image ?? null,
      parentId: input.parentId ?? null
    }
  });
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError("Category not found", 404);
  }

  let slug = existing.slug;
  if (input.slug || input.name) {
    slug = await ensureUniqueSlug(slugify(input.slug ?? input.name ?? existing.name), id);
  }

  if (input.parentId) {
    if (input.parentId === id) {
      throw new HttpError("Category cannot be its own parent", 400);
    }

    const parent = await prisma.category.findUnique({ where: { id: input.parentId } });
    if (!parent) {
      throw new HttpError("Parent category not found", 404);
    }
  }

  return prisma.category.update({
    where: { id },
    data: {
      name: input.name,
      slug,
      description: input.description,
      image: input.image,
      parentId: input.parentId
    }
  });
}

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true, children: true } } }
  });

  if (!existing) {
    throw new HttpError("Category not found", 404);
  }

  if (existing._count.products > 0 || existing._count.children > 0) {
    throw new HttpError("Category has linked products or subcategories", 409);
  }

  await prisma.category.delete({ where: { id } });
}
