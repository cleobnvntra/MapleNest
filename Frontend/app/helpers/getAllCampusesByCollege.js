const getAllCampusesByCollege = (data, collegeName) => {
  let campuses = [];

  data.forEach((neighborhood) => {
    neighborhood.college.forEach((college) => {
      if (college.name === collegeName) {
        college.campus.forEach((campusDetail) => {
          const campusName = campusDetail.name.name; // Accessing the nested name property
          // Check if the campus name is already in the array to ensure uniqueness
          const isUnique = !campuses.some((c) => c.campusName === campusName);

          if (isUnique) {
            campuses.push({
              campusName: campusName,
              latitude: campusDetail.name.latitude,
              longitude: campusDetail.name.longitude,
              timeToCampus: campusDetail.time_to_campus,
            });
          }
        });
      }
    });
  });

  return campuses;
};

export default getAllCampusesByCollege;
