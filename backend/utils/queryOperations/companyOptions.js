export const buildCompanyQuery = (query = {}) => {
  const filter = {};

  if (query.industry) filter.industry = { $regex: query.industry, $options: "i" };
  if (query.size) filter.size = query.size;
  if (query.location) filter.location = { $regex: query.location, $options: "i" };
  if (query.verified) filter.verified = query.verified === "true";

  if (query.foundedAfter || query.foundedBefore) {
    filter.foundedYear = {};
    if (query.foundedAfter) filter.foundedYear.$gte = Number(query.foundedAfter);
    if (query.foundedBefore) filter.foundedYear.$lte = Number(query.foundedBefore);
  }

  return filter;
};