export const articleOptions = (query) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    search,
    ...filters
  } = query;

  // Convert page/limit to numbers
  const skip = (Number(page) - 1) * Number(limit);

  // Search logic (title + content)
  const searchFilter = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  // Tag filtering (e.g., ?tags=react,node)
  if (filters.tags) {
    filters.tags = {
      $in: filters.tags.split(",").map((tag) => tag.trim().toLowerCase()),
    };
  }

  return {
    filter: { ...filters, ...searchFilter },
    skip,
    limit: Number(limit),
    sort: { [sortBy]: order === "asc" ? 1 : -1 },
  };
};
