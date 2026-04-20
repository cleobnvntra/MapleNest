const getCollegeByName = (neighbourhood, collegeName) => {
  const collegeElem = neighbourhood.college.find(
    (c) => c.name.trim() === collegeName.trim()
  );

  return collegeElem;
};

export default getCollegeByName;
