'use client';

import useSWR from "swr";
import getAPIUrl from "./utils/getAPIUrl";

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const apiURL = getAPIUrl();

const useFetcher = (path) => {
  return useSWR(`${apiURL}${path}`, fetcher);
};

export default useFetcher;
