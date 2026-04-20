const formatShortWeekday = (locale, date) => {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
};

export default formatShortWeekday;
