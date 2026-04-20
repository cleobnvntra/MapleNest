class PredictionService {
  async predict(neighborhood, apartmentType, date) {
    const requestBody = {
      Inputs: {
        columns: ["Neighbourhood", "Apartment Type", "Date"],
        index: [1],
        data: [[neighborhood, apartmentType, date]],
      },
    };

    console.log("PRINTING REQUEST BODY");
    console.log(requestBody);

    console.log("PRINTING ADDITIONAL INFO");
    console.log(neighborhood, apartmentType, date);

    let rmse = 95.887;
    const z_score = 2.576;

    const requestHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ML_API_KEY}`,
    });

    const url = process.env.ML_API_ENDPOINT;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: requestHeaders,
    });

    if (!response.ok) {
      console.error("Response Headers:", Array.from(response.headers));
      const errorText = await response.text();
      throw new Error(`API call failed: ${errorText}`);
    }

    const json = await response.json();
    console.log(json);

    json[0] += rmse;
    const confidence_interval_lower = json[0] - z_score * rmse;
    const confidence_interval_upper = json[0] + z_score * rmse;

    const object = {
      predicted_value: json[0],
      range: {
        lower: confidence_interval_lower,
        upper: confidence_interval_upper,
      },
    };

    return object;
  }
}

module.exports = PredictionService;
