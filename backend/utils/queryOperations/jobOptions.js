export const jobOptions = (query = {}) => {
  const filter = {};

  if (query.type) filter.type = query.type;
  if (Array.isArray(query.location)) {
    filter.location = { $in: query.location };
  } else if (query.location) {
    filter.location = { $regex: query.location, $options: "i" };
  }
  if (query.industry) {
    // If industry is an array, match any; if string, allow partial search
    if (Array.isArray(query.industry)) {
      filter.industry = { $in: query.industry };
    } else {
      filter.industry = { $regex: query.industry, $options: "i" };
    }
  }
  if (query.status) filter.status = query.status;

  if (query.minSalary || query.maxSalary) {
    filter["salaryRange.min"] = {};
    if (query.minSalary)
      filter["salaryRange.min"].$gte = Number(query.minSalary);
    if (query.maxSalary)
      filter["salaryRange.min"].$lte = Number(query.maxSalary);
  }

  return filter;
};
