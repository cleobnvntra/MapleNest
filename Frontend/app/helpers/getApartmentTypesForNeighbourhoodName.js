const getApartmentTypesForNeighbourhoodName = (data, neighbourhoodName) => {
    // Find the neighborhood object that matches the provided neighbourhoodName.
    const neighbourhood = data.find(n => n.name === neighbourhoodName);
    
    // If the neighborhood is found, return the apartment types for that neighborhood.
    // If not found, return null to indicate that the neighborhood does not exist in the data.
    return neighbourhood ? neighbourhood["Apartment Type"] : null;
  };
  
  export default getApartmentTypesForNeighbourhoodName;