export default (timeStr) => {
  const parts = timeStr.match(/(\d+)\s*hour[s]?|(\d+)\s*min[s]?/g);
  let minutes = 0;
  parts.forEach((part) => {
    if (part.includes("hour")) {
      minutes += parseInt(part) * 60;
    } else if (part.includes("min")) {
      minutes += parseInt(part);
    }
  });
  return minutes;
};
