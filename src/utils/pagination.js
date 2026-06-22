export function paginate(page = 1, limit = 10) {
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const pageNum = Math.max(1, Number.isNaN(parsedPage) ? 1 : parsedPage);
  const limitNum = Math.max(1, Math.min(100, Number.isNaN(parsedLimit) ? 10 : parsedLimit));
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
}

export function formatPaginatedResponse(items, total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
