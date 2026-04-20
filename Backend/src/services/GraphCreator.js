const { createCanvas, registerFont } = require("canvas");
const Chart = require("chart.js/auto");
const ChartDataLabels = require("chartjs-plugin-datalabels");

class GraphCreator {
  constructor(generalStyle) {
    registerFont(`${__dirname}/OpenSans-Regular.ttf`, { family: "Open" });
    this.generalStyle = {};
    this.generalStyle.width = generalStyle.width || 500;
    this.generalStyle.height = generalStyle.height || 500;
    this.generalStyle.title = generalStyle.title || "Stats";
  }

  style(styleObj) {
    this.currentGraphStyle = {
      backgroundColor: styleObj.backgroundColor
        ? styleObj.backgroundColor
        : ["#3366ff"],
      borderColor: [styleObj.borderColor || "#3333cc"],
      textColor: styleObj.textColor || "#FFF",
    };
    return this;
  }

  drawHorizontalBarChart(data, labelCB, valueCB) {
    const canvas = createCanvas(
      this.generalStyle.width,
      this.generalStyle.height
    );
    const ctx = canvas.getContext("2d");

    const labels = data.map(labelCB);
    const values = data.map(valueCB);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: this.generalStyle.title,
            data: values,
            borderWidth: 1,
            ...this.currentGraphStyle,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              font: {
                size: 40,
                family: "Open",
              },
            },
          },
        },
        indexAxis: "y", // This makes the bar chart horizontal
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 30,
                family: "Open",
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 30,
                family: "Open",
              },
            },
          },
        },
      },
    });

    const buffer = canvas.toBuffer("image/png");
    return buffer;
  }

  drawPyChart(data, labelCB, valueCB) {
    const canvas = createCanvas(
      this.generalStyle.width,
      this.generalStyle.height
    );
    const ctx = canvas.getContext("2d");

    const labels = data.map(labelCB);

    const values = data.map(valueCB);

    // Calculate percentages for each slice
    const total = values.reduce((acc, val) => acc + val, 0);
    let percentagesBiggerThanZero = 0;

    const percentages = values.map((value) => {
      const p = ((value / total) * 100).toFixed(2);
      if (p > 0) {
        percentagesBiggerThanZero++;
      }
      return p;
    });

    if (percentagesBiggerThanZero === 1) {
      this.currentGraphStyle.borderColor =
        this.currentGraphStyle.backgroundColor[0];
    }

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: this.generalStyle.title,
            data: values,
            backgroundColor: this.currentGraphStyle.backgroundColor,
            borderColor: this.currentGraphStyle.borderColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: {
                size: 30,
                family: "Open",
              },
            },
          },
          title: {
            display: true,
            text: this.generalStyle.title,
            font: {
              size: 40,
              family: "Open",
            },
          },
          // Include datalabels plugin configuration
          datalabels: {
            color: this.currentGraphStyle.textColor,
            formatter: (value, ctx) => {
              // Do not display the label for 0 values
              return value === 0 ? "" : percentages[ctx.dataIndex] + "%";
            },
            font: {
              size: 30, // Adjust font size for data labels on the pie chart
              family: "Open",
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    const buffer = canvas.toBuffer("image/png");
    return buffer;
  }
}

module.exports = GraphCreator;
