import getAPIUrl from "./getAPIUrl";

const fetchIMGData = async (path, options = {}) => {
  const apiURL = getAPIUrl();
  try {
    const response = await fetch(`${apiURL}${path}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Fetching error: ", error);
    return null;
  }
};

export default fetchIMGData;
