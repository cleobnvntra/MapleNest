import timeToMinutes from "../translation/utils/timeToMinutes";

const sortDataByTimeToCampus = (data, selectedCollege, selectedCampus) => {
  if (selectedCollege && selectedCampus) {
    const dataCopy = JSON.parse(JSON.stringify(data));

    const newArray = dataCopy.sort((a, b) => {
      const aCollege = a.college.find((col) => col.name === selectedCollege);
      const bCollege = b.college.find((col) => col.name === selectedCollege);

      const aCampus = aCollege?.campus.find(
        (camp) => camp.name.name === selectedCampus
      );
      const bCampus = bCollege?.campus.find(
        (camp) => camp.name.name === selectedCampus
      );

      const aTime = aCampus ? timeToMinutes(aCampus.time_to_campus) : Infinity;
      const bTime = bCampus ? timeToMinutes(bCampus.time_to_campus) : Infinity;

      return aTime - bTime;
    });
    return newArray;
  }
  return data;
};

export default sortDataByTimeToCampus;
