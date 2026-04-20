import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import fetchData from "../utils/fetchJSONData";

const downloadNeighbourhoodDetailsPDF = async (apiKey, graphSrc) => {
  let jsonData;
  try {
    const res = await fetchData("/data/all_graphs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apikey: apiKey }),
    });

    //sort the data by interestPoints in descending order
    jsonData = res.sort((a, b) => b.interestPoints - a.interestPoints);
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
      pdf.text("Top 10 popular neighbourhoods", pdfWidth / 2, 80, {align: 'center'});
  
      pdf.addImage(graphSrc, "PNG", 15, 100, 180, 120); // Adjust the height if needed

      let row = 0;
      const totalPoints = jsonData.reduce((acc, item) => acc + item.interestPoints, 0);
      for (let i=0; i < jsonData.length; ++i) {
        if (i % 18 === 0) {
          pdf.addPage();
          pdf.setFontSize(28)
          pdf.addImage(mapleNestIcon, "PNG", 10, 10, 50, 40);
          pdf.setFont(undefined, 'normal');
          pdf.text("Maple Nest", 112, 25); // Text next to the icon
          pdf.text("In Demand Neighbourhoods", 72, 40);
          row = 0;
        }

        if (i == 1) {
          pdf.setFont(undefined, 'bold');
          pdf.setFontSize(28)
          pdf.text("Full Report", pdfWidth / 2, 80, {align: 'center'});
        }

        if (row == 0) {
          pdf.setFont(undefined, 'bold');
          pdf.setFontSize(18);
          pdf.text("Neighbourhoods", 10, 100);
        }
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'normal'); 
        pdf.text(`${i+1}. ${jsonData[i].name}`, 10, 110 + (row*10));

        if (row == 0) {
          pdf.setFontSize(18);
          pdf.setFont(undefined, 'bold');
          pdf.text("Interest Points", 140, 100, {align: 'center'});
        }
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'normal');
        pdf.text(`${jsonData[i].interestPoints.toString()}`, 140, 110 + (row * 10), {align: 'right'});

        if (row == 0) {
          pdf.setFontSize(18);
          pdf.setFont(undefined, 'bold');
          pdf.text(`Interest (%)`, pdfWidth - 10, 100, {align: 'right'});
        }
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'normal');
        const interestPercent = ((jsonData[i].interestPoints / totalPoints)*100).toFixed(2)
        pdf.text(`${interestPercent}%`, 175, 110 + (row * 10));
        row++;
      }
  
      // pdf.save("download.pdf");
      window.open(pdf.output('bloburl'), '_blank');
    });
};
export default downloadNeighbourhoodDetailsPDF;