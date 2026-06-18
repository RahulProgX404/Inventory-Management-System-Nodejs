export function paginate(page = 1, limit = 10) {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
}

export function formatPaginatedResponse(items, total, page, limit) {
  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
