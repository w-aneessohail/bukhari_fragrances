export function parsePaginationParams(query: { page?: string; limit?: string }) {
  const page = Math.max(Number(query.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(query.limit ?? 10), 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildPaginationMeta(params: { page: number; limit: number; totalItems: number }) {
  const totalPages = Math.max(Math.ceil(params.totalItems / params.limit), 1);

  return {
    page: params.page,
    limit: params.limit,
    totalItems: params.totalItems,
    totalPages
  };
}
