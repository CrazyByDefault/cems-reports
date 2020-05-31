const fs = require('fs');
const dateFormat = require('dateformat');
const { CanvasRenderService } = require('chartjs-node-canvas');

const width = 630;
const height = 350;

const chartGen = {};

const chartCallback = (ChartJS) => {

    // Global config example: https://www.chartjs.org/docs/latest/configuration/
  ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
    // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
  ChartJS.plugins.register({
        // plugin implementation
  });
    // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
  ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
        // chart implementation
  });
};
const canvasRenderService = new CanvasRenderService(width, height, chartCallback);

chartGen.dailyGraph = async (data) => {
  console.log("Attempting to print data", data.tAlt, data.y);
  // const configurationScatter = {
  //   type: 'scatter',
  //   data: data,
  //   options: {
  //     scales: {
  //       yAxes: [{
  //         ticks: {
  //           beginAtZero: true,
  //           callback: (value) => value + "KVA"
  //         }
  //       }]
  //     }
  //   }
  // };
  const configLine = {
    type: 'line',
    data: {
      labels: data.t,
      datasets: [
        {
          data: data.y,
          borderColor: "#3e95cd",
          label: "kVA",
          fill: false
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: (value) => value + "KVA"
          }
        }]
      },
      xAxes: [{
        type: "time",
        time: {
          unit: "hour"
        },
        ticks: {
          display: false,
        }
      }]
    }
  };
  const image = await canvasRenderService.renderToBuffer(configLine);
  console.log("done writing buffer to var");
    // const dataUrl = await canvasRenderService.renderToDataURL(configuration);
    // const stream = canvasRenderService.renderToStream(configuration);
  const dateStub = dateFormat(new Date(), "yyyy-mm-dd");
  const baseDir = "./output/iith/Daily_Reports/images";
  fs.writeFileSync(`${baseDir}/iith_${dateStub}_daily.png`, image);
  console.log("Done writing file");
  // fs.mkdir(baseDir, { recursive: true }, (err) => {
  //   if (err) throw err;
  //   return;
  // });
};

chartGen.weeklyGraph = async (data) => {
  console.log("Attempting to print data", data.t, data.y);
  const configLine = {
    type: 'bar',
    data: {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"],
      datasets: [
        {
          data: data.y,
          // borderColor: "#3e95cd",
          backgroundColor: "#3e95cd",
          label: "kWH",
          // fill: true
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: (value) => value + "KVA"
          }
        }]
      },
      xAxes: [{
        type: "time",
        time: {
          unit: "hour"
        },
        ticks: {
          display: false,
        }
      }]
    }
  };
  const image = await canvasRenderService.renderToBuffer(configLine);
  console.log("done writing buffer to var");
    // const dataUrl = await canvasRenderService.renderToDataURL(configuration);
    // const stream = canvasRenderService.renderToStream(configuration);
  const dateStub = dateFormat(new Date(), "W");
  const baseDir = "./output/iith/Weekly_Reports/images";
  fs.writeFileSync(`${baseDir}/iith_${dateStub}.png`, image);
  console.log("Done writing file");
  // fs.mkdir(baseDir, { recursive: true }, (err) => {
  //   if (err) throw err;
  //   return;
  // });
};

chartGen.monthlyGraph = async (data) => {
  console.log("Attempting to print data", data.t, data.y);
  const configLine = {
    type: 'bar',
    data: {
      labels: data.t,
      datasets: [
        {
          data: data.y,
          // borderColor: "#3e95cd",
          backgroundColor: "#3e95cd",
          label: "kWH",
          // fill: true
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: (value) => value + "KVA"
          }
        }]
      },
      xAxes: [{
        type: "time",
        time: {
          unit: "hour"
        },
        ticks: {
          display: false,
        }
      }]
    }
  };
  const image = await canvasRenderService.renderToBuffer(configLine);
  console.log("done writing buffer to var");
    // const dataUrl = await canvasRenderService.renderToDataURL(configuration);
    // const stream = canvasRenderService.renderToStream(configuration);
  const dateStub = dateFormat(new Date(), "mmm");
  const baseDir = "./output/iith/Monthly_Reports/images";
  fs.writeFileSync(`${baseDir}/iith_${dateStub}.png`, image);
  console.log("Done writing file");
  // fs.mkdir(baseDir, { recursive: true }, (err) => {
  //   if (err) throw err;
  //   return;
  // });
};

module.exports = chartGen;
