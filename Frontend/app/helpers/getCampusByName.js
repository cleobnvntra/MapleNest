const getCampusByName = (college, campusName) => {
  const campus = college?.campus.find((c) => c.name.name === campusName);
  return campus;
};

export default getCampusByName;
