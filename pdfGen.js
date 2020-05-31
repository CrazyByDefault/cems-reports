const PDFDocument = require('pdfkit');
const dateFormat = require('dateformat');
const fs = require('fs');

var pdfGen = {};
// const day = dateFormat(now, "dS mmmm, yyyy");

// Create a document

pdfGen.generateDaily = (data) =>  {
  const { peakLoadVal, peakLoadTime, baseLoadVal, energyConsumed, date } = data;
  now = date;
  const dateStub = dateFormat(new Date(), "yyyy-mm-dd");
  const doc = new PDFDocument({size: 'A4'});
  console.log(doc.x, doc.y);

  // Pipe its output somewhere, like to a file or HTTP response
  // See below for browser usage
  // doc.pipe(fs.createWriteStream('output.pdf'));

  // doc.rect(doc.x, 0, 410, doc.y).stroke();

  // Embed a font, set the font size, and render some text
  doc.fillColor("#000000").lineWidth(1.6).rect(8, 8, 579, 825).stroke();
  // doc.lineWidth(1.6).rect(8, 8, 579, 825).fill("#F3F0EE");
  doc.image('horzlogolong.png', doc.x+75, doc.y-25, { fit: [300, 80], valign: "center", align: 'center' });
  doc.moveTo(72, doc.y+70).lineTo(523, doc.y+70).stroke();
  doc.fontSize(18).fillColor("#00796b").font("fonts/Muli-Bold.ttf")
  .text('Daily Energy Report', 72, doc.y+80, { align: "center" });

  doc.moveDown().fillColor("#000000").font('fonts/Muli-Light.ttf');
  doc.fontSize(12).font('fonts/Muli-SemiBold.ttf').text(`Date: ${dateFormat(now, "dS mmmm, yyyy")}`, { align: "left" });
  doc.moveUp();
  doc.fontSize(12).font('fonts/Muli-SemiBold.ttf').text(`Day: ${dateFormat(now, "dddd")}`, { align: "center" });
  doc.moveUp();
  doc.fontSize(12).font('fonts/Muli-SemiBold.ttf').text(`Campus: IITH`, { align: "right" });

  // Add an image, constrain it to a given size, and center it vertically and horizontally
  doc.moveDown(3);
  console.log(doc.x, doc.y);
  var GraphRectX = doc.x;
  var GraphRectY = doc.y;
  doc.image(`./output/iith/Daily_Reports/images/iith_${dateStub}_daily.png`, {
    fit: [450, 250],
    align: 'center',
    valign: 'center'
  }).rect(GraphRectX, GraphRectY, 450, 260).stroke();

  var TextX = 72;
  var TextCol2X = 260;
  doc.moveDown();
  doc.fontSize(14).text("-- DESCRIPTION OF METER --", TextX, GraphRectY+300, { align: "center" });
  doc.moveDown();
  doc.font("fonts/Muli-SemiBold.ttf").fontSize(12).text(`Base Load:`, TextX, doc.y);
  doc.moveUp().font('fonts/Muli-Light.ttf').text(`${baseLoadVal} kVA`, TextCol2X, doc.y);

  doc.font("fonts/Muli-SemiBold.ttf").fontSize(12).text(`Peak Load:`, TextX, doc.y);
  doc.moveUp().font('fonts/Muli-Light.ttf').text(`${peakLoadVal} kVA`, TextCol2X, doc.y);

  doc.font("fonts/Muli-SemiBold.ttf").fontSize(12).text(`Peak Time:`, TextX, doc.y);
  doc.moveUp().font('fonts/Muli-Light.ttf').text(`${dateFormat(peakLoadTime, "HH:mm")}`, TextCol2X, doc.y);

  doc.font("fonts/Muli-SemiBold.ttf").fontSize(12).text(`Energy Consumed:`, TextX, doc.y);
  doc.moveUp().font('fonts/Muli-Light.ttf').text(`${energyConsumed} kVH`, TextCol2X, doc.y);

  doc.font("fonts/Muli-SemiBold.ttf").fontSize(12).text(`Energy Cost:`, TextX, doc.y);
  doc.moveUp().font('fonts/Muli-Light.ttf').text(`${energyConsumed * 7} Rs.`, TextCol2X, doc.y);

  doc.moveDown(5);
  doc.font("fonts/Muli-Italic.ttf").fontSize(10).text("This is an Auto Generated Report, for feedback email - iith_ems1@iith.ac.in", TextX, doc.y);


  // Finalize PDF file
  doc.pipe(fs.createWriteStream(`./output/iith/Daily_Reports/iith_${dateStub}.pdf`))
  .on('finish', function () {
    console.log('PDF closed');
  });

  doc.end();
};

pdfGen.generateWeekly = (data) =>  {
  const { peakLoadVal, peakLoadTime, energyConsumed, date } = data;
  now = date;
  const dateStub = dateFormat(new Date(), "W");
  const doc = new PDFDocument({size: 'A4'});
  console.log(doc.x, doc.y);

  // Pipe its output somewhere, like to a file or HTTP response
  // See below for browser usage
  // doc.pipe(fs.createWriteStream('output.pdf'));

  // doc.rect(doc.x, 0, 410, doc.y).stroke();

  // Embed a font, set the font size, and render some text
  doc.fillColor("#000000").lineWidth(1.6).rect(8, 8, 579, 825).stroke();
  // doc.lineWidth(1.6).rect(8, 8, 579, 825).fill("#F3F0EE");
  doc.image('horzlogolong.png', doc.x+75, doc.y-25, { fit: [300, 80], valign: "center", align: 'center' });
  doc.moveTo(72, doc.y+70).lineTo(523, doc.y+70).stroke();
  doc.fontSize(18).fillColor("#558b2f").font("fonts/Muli-Bold.ttf")
  .text('Weekly Energy Report', 72, doc.y+80, { align: "center" });

  doc.moveDown().fillColor("#000000").font('fonts/Muli-Light.ttf');
  doc.fontSize(12).font('fonts/Muli-SemiBold.ttf').text(`Week Number: ${dateFormat(now, "W")}`, { align: "center" });
  doc.moveUp();
  doc.fontSize(12).font('fonts/Muli-SemiBold.ttf').text(`Month: ${dateFormat(now, "mmm yyyy")}`, { align: "left" });
  doc.moveUp();
  doc.fontSize(12).font('fonts/Muli-SemiBold.ttf').text(`Campus: IITH`, { align: "right" });

  // Add an image, constrain it to a given size, and center it vertically and horizontally
  doc.moveDown(3);
  console.log(doc.x, doc.y);
  var GraphRectX = doc.x;
  var GraphRectY = doc.y;
  doc.image(`./output/iith/Weekly_Reports/images/iith_${dateStub}.png`, {
    fit: [450, 250],
    align: 'center',
    valign: 'center'
  }).rect(GraphRectX, GraphRectY, 450, 260).stroke();

  var TextX = 72;
  var TextCol2X = 260;
  doc.moveDown();
  doc.fontSize(14).text("-- DESCRIPTION OF METER --", TextX, GraphRectY+300, { align: "center" });
  doc.moveDown();

  doc.font("fonts/Muli-SemiBold.ttf").fontSize(12).text(`Weekly Total Energy:`, TextX, doc.y);
  doc.moveUp().font('fonts/Muli-Light.ttf').text(`${energyConsumed} kVH`, TextCol2X, doc.y);

  doc.font("fonts/Muli-SemiBold.ttf").fontSize(12).text(`Peak Load:`, TextX, doc.y);
  doc.moveUp().font('fonts/Muli-Light.ttf').text(`${peakLoadVal} kVA`, TextCol2X, doc.y);

  doc.font("fonts/Muli-SemiBold.ttf").fontSize(12).text(`Peak Time:`, TextX, doc.y);
  doc.moveUp().font('fonts/Muli-Light.ttf').text(`${dateFormat(peakLoadTime, "ddd dS HH:mm")}`, TextCol2X, doc.y);

  doc.moveDown(5);
  doc.font("fonts/Muli-Italic.ttf").fontSize(10).text("This is an Auto Generated Report, for feedback email - iith_ems1@iith.ac.in", TextX, doc.y);


  // Finalize PDF file
  doc.pipe(fs.createWriteStream(`./output/iith/Weekly_Reports/iith_${dateStub}.pdf`))
  .on('finish', function () {
    console.log('PDF closed');
  });

  doc.end();
};

pdfGen.generateMonthly = (data) =>  {
  const { peakLoadVal, peakLoadTime, energyConsumed, date } = data;
  now = date;
  const dateStub = dateFormat(new Date(), "mmm");
  const doc = new PDFDocument({size: 'A4'});
  console.log(doc.x, doc.y);

  // Pipe its output somewhere, like to a file or HTTP response
  // See below for browser usage
  // doc.pipe(fs.createWriteStream('output.pdf'));

  // doc.rect(doc.x, 0, 410, doc.y).stroke();

  // Embed a font, set the font size, and render some text
  doc.fillColor("#000000").lineWidth(1.6).rect(8, 8, 579, 825).stroke();
  // doc.lineWidth(1.6).rect(8, 8, 579, 825).fill("#F3F0EE");
  doc.image('horzlogolong.png', doc.x+75, doc.y-25, { fit: [300, 80], valign: "center", align: 'center' });
  doc.moveTo(72, doc.y+70).lineTo(523, doc.y+70).stroke();
  doc.fontSize(18).fillColor("#e65100").font("fonts/Muli-Bold.ttf")
  .text('Monthly Energy Report', 72, doc.y+80, { align: "center" });

  doc.moveDown().fillColor("#000000").font('fonts/Muli-Light.ttf');
  // doc.fontSize(12).font('fonts/Muli-SemiBold.ttf').text(`Week Number: ${dateFormat(now, "W")}`, { align: "center" });
  // doc.moveUp();
  doc.fontSize(12).font('fonts/Muli-SemiBold.ttf').text(`Month: ${dateFormat(now, "mmm yyyy")}`, { align: "left" });
  doc.moveUp();
  doc.fontSize(12).font('fonts/Muli-SemiBold.ttf').text(`Campus: IITH`, { align: "right" });

  // Add an image, constrain it to a given size, and center it vertically and horizontally
  doc.moveDown(3);
  console.log(doc.x, doc.y);
  var GraphRectX = doc.x;
  var GraphRectY = doc.y;
  doc.image(`./output/iith/Monthly_Reports/images/iith_${dateStub}.png`, {
    fit: [450, 250],
    align: 'center',
    valign: 'center'
  }).rect(GraphRectX, GraphRectY, 450, 260).stroke();

  var TextX = 72;
  var TextCol2X = 260;
  doc.moveDown();
  doc.fontSize(14).text("-- DESCRIPTION OF METER --", TextX, GraphRectY+300, { align: "center" });
  doc.moveDown();

  doc.font("fonts/Muli-SemiBold.ttf").fontSize(12).text(`Monthly Total Energy:`, TextX, doc.y);
  doc.moveUp().font('fonts/Muli-Light.ttf').text(`${energyConsumed} kVH`, TextCol2X, doc.y);

  doc.font("fonts/Muli-SemiBold.ttf").fontSize(12).text(`Peak Load:`, TextX, doc.y);
  doc.moveUp().font('fonts/Muli-Light.ttf').text(`${peakLoadVal} kVA`, TextCol2X, doc.y);

  doc.font("fonts/Muli-SemiBold.ttf").fontSize(12).text(`Peak Time:`, TextX, doc.y);
  doc.moveUp().font('fonts/Muli-Light.ttf').text(`${dateFormat(peakLoadTime, "dS mmm HH:mm")}`, TextCol2X, doc.y);

  doc.moveDown(5);
  doc.font("fonts/Muli-Italic.ttf").fontSize(10).text("This is an Auto Generated Report, for feedback email - iith_ems1@iith.ac.in", TextX, doc.y);


  // Finalize PDF file
  doc.pipe(fs.createWriteStream(`./output/iith/Monthly_Reports/iith_${dateStub}.pdf`))
  .on('finish', function () {
    console.log('PDF closed');
  });

  doc.end();
};

module.exports = pdfGen;
