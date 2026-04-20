import getAPIUrl from "./getAPIUrl";

const fetchData = async (path, options = {}) => {
  const apiURL = getAPIUrl();
  try {
    const response = await fetch(`${apiURL}${path}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetching error: ", error);
    return null;
  }
};

export default fetchData;
