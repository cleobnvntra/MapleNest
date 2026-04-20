const translateDuration = (duration, t) => {
  let translatedDuration = "";

  // Regex to extract hours and minutes from the duration string
  const hourRegex = /(\d+)\s+hour/;
  const minuteRegex = /(\d+)\s+min/;

  const hours = hourRegex.exec(duration);
  const minutes = minuteRegex.exec(duration);

  if (hours) {
    translatedDuration += t("hour", { count: parseInt(hours[1], 10) }) + " ";
  }

  if (minutes) {
    translatedDuration += t("minute", { count: parseInt(minutes[1], 10) });
  }

  return translatedDuration.trim();
};

export default translateDuration;
