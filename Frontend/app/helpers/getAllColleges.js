import React from 'react';

const getAllColleges = (data) => {
  let colleges = [];

  data.forEach(neighborhood => {
    neighborhood.college.forEach(college => {
      // Check if the college name is already in the array to ensure uniqueness
      if (!colleges.includes(college.name)) {
        colleges.push(college.name);
      }
    });
  });

  return colleges;
}

export default getAllColleges;
