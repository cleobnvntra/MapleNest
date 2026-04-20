import React from "react";

function extractBed(bed) {
  const matches = bed.match(/\d+/); // Regular expression to match digits
  if (matches) {
    return parseFloat(matches[0]); // Extracted number converted to float
  } else if (bed === "Bachelor") {
    return 0.5;
  } else {
    return null; // Handle other cases if necessary
  }
}

function constructApartmentsDotComURL(url, high, bed) {
  const bed_count = extractBed(bed);

  let choices = "";

  if (bed_count === 0.5) {
    choices = "studios";
  } else if (bed_count === 1) {
    choices = "1-bedrooms";
  } else if (bed_count === 2) {
    choices = "2-bedrooms";
  } else if (bed_count === 3) {
    choices = "3-bedrooms";
  }

  choices += `-under-${high.toFixed(0)}`;

  return `${url}${choices}`;
}

function constructCondosDotCaURL(url, high, bed) {
  const bed_count = extractBed(bed);

  let choices = "";

  if (bed_count === 0.5) {
    choices = "&beds=0.1-0.1";
  } else if (bed_count === 1) {
    choices = "&beds=1-1";
  } else if (bed_count === 2) {
    choices = "&beds=2-2";
  } else if (bed_count === 3) {
    choices = "&beds=3-99";
  }

  choices += `&rent_price_range=0,${high.toFixed(0)}`;

  return `${url}${choices}`;
}

export default function RentLink({ apartments_dot_com, condos_dot_ca, high, bed }) {
  const apartments_url = constructApartmentsDotComURL(apartments_dot_com, high, bed);
  const condos_url = constructCondosDotCaURL(condos_dot_ca, high, bed);

  return (
    <div className={`w-full flex flex-col md:flex-row justify-center pt-2`}>
      <a href={condos_url} target="_blank" className="w-full md:w-auto">
        <button className="w-full md:w-auto bg-[#07364b] hover:bg-[#0f546f] text-white font-bold py-2 px-4 rounded transition ease-in-out duration-150 focus:outline-none focus:ring-opacity-50">
          Condos.ca
        </button>
      </a>
      <div className="m-3 md:m-0 md:ml-3"/>
      <a href={apartments_url} target="_blank" className="w-full md:w-auto">
        <button className="w-full md:w-auto bg-[#478500] hover:bg-[#0B6839] text-white font-bold py-2 px-4 rounded transition ease-in-out duration-150 focus:outline-none focus:ring-opacity-50">
          Apartments.com
        </button>
      </a>
    </div>
  );
}
