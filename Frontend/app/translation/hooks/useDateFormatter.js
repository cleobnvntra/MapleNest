import useCurrentLanguage from "./useCurrentLanguage";

const useDateFormatter = () => {
  const currentLanguage = useCurrentLanguage();

  return (date) => {
    const formatter = new Intl.DateTimeFormat(currentLanguage, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatter.format(date);
  };
};

export default useDateFormatter;
