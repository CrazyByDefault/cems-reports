const chartGen = require("./chartGen.js");
const pdfGen = require("./pdfGen.js");
const mysql = require("mysql");
const dateFormat = require("dateformat");

IITH_con = mysql.createPool({
  host: "127.0.0.1",
  port: 8888,
  user: "bms",
  password: "Sglab_1234",
  database: "IITH_SS_data",
  multipleStatements: true
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

function dailyReport(meterID) {
  const query = `
    SELECT (Stot + 0.0) as y, UNIX_TIMESTAMP(tstamp) as x FROM SS_ems WHERE meterID = ${IITH_con.escape(meterID)} AND DATE(tstamp) = subdate(DATE(NOW()), 35);
    SELECT SUM(Ptot) as energyConsumed FROM SS_ems WHERE meterID = ${IITH_con.escape(meterID)} AND DATE(tstamp) = subdate(DATE(NOW()), 35);
  `;
  IITH_con.query(query, async (err, result) => {
    if (err) {
      console.log(err);
    }
     console.log(result[1]);
    const data = result[0].map((row) => {
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
    await chartGen.dailyGraph(dataArray);
    const valuesArr = [...result[0].map((row) => row.y)];
    const peakLoadVal = Math.max(...result[0].map((row) => row.y));
    const pdfData = {
      peakLoadVal,
      peakLoadTime: result[0][valuesArr.indexOf(peakLoadVal)].x,
      baseLoadVal: Quartile(valuesArr, 0.025),
      energyConsumed: result[1][0].energyConsumed.toFixed(2),
      date: new Date(result[0][0].x * 1000)
    }
    pdfGen.generateDaily(pdfData);
  });
}

function weeklyReport(meterID) {
  const query = `
    SELECT SUM(Ptot + 0.0) as y, DATE(tstamp) as t FROM SS_ems
    WHERE meterID = ${IITH_con.escape(meterID)} AND DATE(tstamp) <= subdate(DATE(NOW()), 35) AND DATE(tstamp) > subdate(DATE(NOW()), 42)
    GROUP BY DATE(tstamp);
    SELECT UNIX_TIMESTAMP(tstamp) as peakLoadTime, (Stot + 0.0) as peakLoadVal FROM SS_ems
    WHERE (meterID = ${IITH_con.escape(meterID)} AND DATE(tstamp) <= subdate(DATE(NOW()), 35) AND DATE(tstamp) > subdate(DATE(NOW()), 42))
    AND Stot = (
      SELECT MAX(Stot) FROM SS_ems
      WHERE (meterID = ${IITH_con.escape(meterID)} AND DATE(tstamp) <= subdate(DATE(NOW()), 35) AND DATE(tstamp) > subdate(DATE(NOW()), 42))
    );
  `;
  IITH_con.query(query, async (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
     console.log(result[1]);
    // const data = result[0].map((row) => {
    //   const newRow = {};
    //   newRow.x = new Date(row.x * 1000).getHours();
    //   newRow.y = row.y;
    //   return newRow;
    // });
    // data.forEach((row) => {
    //   if (!dataArray.t[row.x]) {
    //     dataArray.t[row.x] = row.x;
    //     dataArray.y[row.x] = row.y;
    //   }
    // });
    let dataArray = { t: [], y: []};
    dataArray.t = [...result[0].map((row) => row.t)];
    dataArray.y = [...result[0].map((row) => row.y)];
    console.log(dataArray);
    await chartGen.weeklyGraph(dataArray);
    const valuesArr = [...result[0].map((row) => row.y)];
    const { peakLoadVal, peakLoadTime } = result[1][0];
    const pdfData = {
      peakLoadVal: peakLoadVal.toFixed(2),
      peakLoadTime,
      energyConsumed: (dataArray.y.reduce((a,b) => a + b, 0)).toFixed(2),
      date: new Date(result[0][0].t)
    }
    pdfGen.generateWeekly(pdfData);
  });
}

function monthlyReport(meterID) {
  const query = `
    SELECT SUM(Ptot + 0.0) as y, DATE(tstamp) as t FROM SS_ems
    WHERE meterID = ${IITH_con.escape(meterID)}
    AND MONTH(tstamp) = MONTH(DATE_ADD(NOW(), INTERVAL -3 MONTH))
    AND YEAR(tstamp) = YEAR(DATE_ADD(NOW(), INTERVAL -3 MONTH))
    GROUP BY DATE(tstamp);
    SELECT UNIX_TIMESTAMP(tstamp) as peakLoadTime, (Stot + 0.0) as peakLoadVal FROM SS_ems
    WHERE (
      meterID = ${IITH_con.escape(meterID)}
      AND MONTH(tstamp) = MONTH(DATE_ADD(NOW(), INTERVAL -3 MONTH))
      AND YEAR(tstamp) = YEAR(DATE_ADD(NOW(), INTERVAL -3 MONTH))
    )
    AND Stot = (
      SELECT MAX(Stot) FROM SS_ems
      WHERE (
        meterID = ${IITH_con.escape(meterID)}
        AND MONTH(tstamp) = MONTH(DATE_ADD(NOW(), INTERVAL -3 MONTH))
        AND YEAR(tstamp) = YEAR(DATE_ADD(NOW(), INTERVAL -3 MONTH))
      )
    );
  `;
  IITH_con.query(query, async (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
     console.log(result[1]);
    // const data = result[0].map((row) => {
    //   const newRow = {};
    //   newRow.x = new Date(row.x * 1000).getHours();
    //   newRow.y = row.y;
    //   return newRow;
    // });
    // data.forEach((row) => {
    //   if (!dataArray.t[row.x]) {
    //     dataArray.t[row.x] = row.x;
    //     dataArray.y[row.x] = row.y;
    //   }
    // });
    let dataArray = { t: [], y: []};
    dataArray.t = [...result[0].map((row) => dateFormat(new Date(row.t), "dS"))];
    dataArray.y = [...result[0].map((row) => row.y)];
    console.log(dataArray);
    await chartGen.monthlyGraph(dataArray);
    const valuesArr = [...result[0].map((row) => row.y)];
    const { peakLoadVal, peakLoadTime } = result[1][0];
    const pdfData = {
      peakLoadVal: peakLoadVal.toFixed(2),
      peakLoadTime: new Date(peakLoadTime * 1000),
      energyConsumed: (dataArray.y.reduce((a,b) => a + b, 0)).toFixed(2),
      date: new Date(result[0][0].t)
    }
    pdfGen.generateMonthly(pdfData);
  });
}

dailyReport(17);
weeklyReport(17);
monthlyReport(17);