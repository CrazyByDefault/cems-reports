const chartGen = require("./chartGen.js");
const pdfGen = require("./pdfGen.js");
const mysql = require("mysql");

IITH_con = mysql.createPool({
  host: "127.0.0.1",
  port: 8888,
  user: "bms",
  password: "Sglab_1234",
  database: "IITH_SS_data"
});

function Quartile(data, q) {
  data=Array_Sort_Numbers(data);
  var pos = ((data.length) - 1) * q;
  var base = Math.floor(pos);
  var rest = pos - base;
  if( (data[base+1]!==undefined) ) {
    return data[base] + rest * (data[base+1] - data[base]);
  } else {
    return data[base];
  }
}

function Array_Sort_Numbers(inputarray){
  return inputarray.sort(function(a, b) {
    return a - b;
  });
}

const query = `SELECT (Stot + 0.0) as y, UNIX_TIMESTAMP(tstamp) as x FROM SS_ems WHERE meterID = "14" AND DATE(tstamp) = subdate(DATE(NOW()), 35);`;
IITH_con.query(query, async (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
  const data = result.map((row) => {
    const newRow = {};
    newRow.x = new Date(row.x * 1000).getHours();
    newRow.y = row.y;
    return newRow;
  });
  let dataArray = { t: [], y: []};
  data.forEach((row) => {
    if (!dataArray.t[row.x]) {
      dataArray.t[row.x] = row.x;
      dataArray.y[row.x] = row.y;
    }
  });
  // dataArray.t = [...data.map((row) => row.x)];
  // dataArray.y = [...data.map((row) => row.y)];
  console.log(dataArray);
  await chartGen.dailyReport(dataArray);
  const valuesArr = [...result.map((row) => row.y)];
  const peakLoadVal = Math.max(...result.map((row) => row.y));
  const pdfData = {
    peakLoadVal,
    peakLoadTime: result[valuesArr.indexOf(peakLoadVal)].x,
    baseLoadVal: Quartile(valuesArr, 0.025),
    energyConsumed: 0
  }
  pdfGen.generateDaily(pdfData);
});