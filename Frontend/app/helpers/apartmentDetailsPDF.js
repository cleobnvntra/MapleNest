import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import fetchData from "../utils/fetchJSONData";

const downloadApartmentDetailsPDF = async (apiKey, selectedNeighbourhood, graphSrc) => {
  let jsonData;
  try {
    const res = await fetchData("/data/all_graphs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apikey: apiKey }),
    });

    //get the data for the selected neighbourhood
    jsonData = res.filter((item) => item.name === selectedNeighbourhood);
    console.log(jsonData);
  }
  catch (error) {
    console.log(error);
  }
    const element = document.getElementById("pdf-content");
    
    html2canvas(element, {
      scale: 2 // Adjust according to your needs
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const mapleNestIcon = '/image.png' // Make sure this path is correct and accessible
      const pdf = new jsPDF({
        orientation: "portrait",
      });

      // Calculate new placement for the screenshot
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      // First, add the icon image
      pdf.addImage(mapleNestIcon, "PNG", 10, 10, 50, 40); // Positioned at top-left with a small margin
      pdf.setFontSize(28); // Set the font size
      pdf.text("Maple Nest", 112, 25); // Text next to the icon
      pdf.text("In Demand Neighbourhoods", 72, 40);

      pdf.setFont(undefined, 'bold');
      pdf.text("Popular Apartment Types in:", pdfWidth / 2, 70, {align: 'center'});
      pdf.text(`${jsonData[0].name}`, pdfWidth / 2, 85, {align: 'center'})
  
      pdf.addImage(graphSrc, "PNG", 5, 95, 200, 125); // Adjust the height if needed

      pdf.setFontSize(18);
      pdf.text("Neighbourhood", pdfWidth / 2, 235, {align: 'center'});
      pdf.text("Bachelor", 10, 260);
      pdf.text("1 Bedroom", 55, 260);
      pdf.text("2 Bedroom", 115, 260);
      pdf.text("3 Bedroom", pdfWidth - 10, 260, {align: 'right'});

      pdf.setFontSize(14);
      pdf.setFont(undefined, 'normal');
      pdf.text(jsonData[0].name, pdfWidth / 2, 245, {align: 'center'});

      let totalPoints = 0;
      for(const i in jsonData[0]["Apartment Type Interest Points"]) {
        totalPoints += jsonData[0]["Apartment Type Interest Points"][i];
      }

      if (jsonData[0]["Apartment Type"].includes("Bachelor")) {
        const percentage = ((jsonData[0]["Apartment Type Interest Points"]["Bachelor"].toString() / totalPoints) * 100).toFixed(2);
        pdf.text(`${percentage}%`, 23, 270, {align: 'center'});
        pdf.text(`${jsonData[0]["Apartment Type Interest Points"]["Bachelor"].toString()} points`, 23, 280, {align: 'center'});
      }
      else {
        pdf.text("N/A", 18, 270);
      }

      if (jsonData[0]["Apartment Type"].includes("1Bedroom")) {
        const percentage = ((jsonData[0]["Apartment Type Interest Points"]["1Bedroom"].toString() / totalPoints) * 100).toFixed(2);
        pdf.text(`${percentage}%`, 73, 270, {align: 'center'});
        pdf.text(`${jsonData[0]["Apartment Type Interest Points"]["1Bedroom"].toString()} points`, 73, 280, {align: 'center'});
      }
      else {
        pdf.text("N/A", 67, 270);
      }

      if (jsonData[0]["Apartment Type"].includes("2Bedroom")) {
        const percentage = ((jsonData[0]["Apartment Type Interest Points"]["2Bedroom"].toString() / totalPoints) * 100).toFixed(2);
        pdf.text(`${percentage}%`, 133, 270, {align: 'center'});
        pdf.text(`${jsonData[0]["Apartment Type Interest Points"]["2Bedroom"].toString()} points`, 132, 280, {align: 'center'});
      }
      else {
        pdf.text("N/A", 127, 270);
      }

      if (jsonData[0]["Apartment Type"].includes("3Bedroom")) {
        const percentage = ((jsonData[0]["Apartment Type Interest Points"]["3Bedroom"].toString() / totalPoints) * 100).toFixed(2);
        pdf.text(`${percentage}%`, 185, 270, {align: 'center'});
        pdf.text(`${jsonData[0]["Apartment Type Interest Points"]["3Bedroom"].toString()} points`, 185, 280, {align: 'center'});
      }
      else {
        pdf.text("N/A", 179, 270);
      }
  
      window.open(pdf.output('bloburl'), '_blank');
    });
};
export default downloadApartmentDetailsPDF;