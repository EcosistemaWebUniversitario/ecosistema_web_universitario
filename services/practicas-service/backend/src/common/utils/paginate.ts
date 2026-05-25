export function paginate<T>(items: T[], total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);

  return {
    data: items,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}