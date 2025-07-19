export const jobOptions = (query = {}) => {
  const filter = {};

  if (query.type) filter.type = query.type;
  if (query.location) filter.location = { $regex: query.location, $options: "i" };
  if (query.industry) filter.industry = { $regex: query.industry, $options: "i" };
  if (query.status) filter.status = query.status;

  if (query.minSalary || query.maxSalary) {
    filter["salaryRange.min"] = {};
    if (query.minSalary) filter["salaryRange.min"].$gte = Number(query.minSalary);
    if (query.maxSalary) filter["salaryRange.min"].$lte = Number(query.maxSalary);
  }

  return filter;
};