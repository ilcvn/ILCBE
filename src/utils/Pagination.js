function paginate(query, page = 1, limit = 20, sort = {}) {
  const skip = (page - 1) * limit;
  return {
    ...query,
    skip,
    limit: parseInt(limit),
    sort,
  };
}

module.exports = {
  paginate,
};
