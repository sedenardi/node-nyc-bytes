var Bytes = require('../lib/bytes.js'),
    testFunctions = require('./testFunctions.js');

var records = {
  MN: ['1000010010','1004370018','1011990044','1019030041','1020870091'],
  BX: ['2024210033','2029550018','2037850010','2045930006','2056310011'],
  BK: ['3000010001','3017800069','3048500041','3066700043','3088180014'],
  QN: ['4000060001','4027730050','4070210131','4110440047','4161110043'],
  SI: ['5000010010','5016150074','5032520045','5051560055','5078180009']
};

var objIndexFunction = function(record,records) {
  return records.indexOf(record.BBL);
};

var geoIndexFunction = function(record,records) {
  return records.indexOf(record.properties.BBL.toString());
};

describe('Pluto', function(){
  var dataset = Bytes.Pluto;
  var counts = { MN: 43231, BX: 89963, BK: 277748, QN: 324630, SI: 123892 };
  testFunctions.allTests(dataset, { }, objIndexFunction, records, counts);
});

describe('MapPluto', function(){
  var dataset = Bytes.MapPluto;
  var counts = { MN: 42786, BX: 89741, BK: 277097, QN: 324242, SI: 123592 };
  testFunctions.allTests(dataset, { }, geoIndexFunction, records, counts);
});

describe('ZoningTaxLot', function(){
  var dataset = Bytes.ZoningTaxLot;
  var counts = { MN: 43145, BX: 89842, BK: 277390, QN: 324425, SI: 124001 };
  testFunctions.allTests(dataset, { }, objIndexFunction, records, counts);
});

describe('PAD', function(){
  var dataset = Bytes.PAD;
  var bblCounts = { Total: 880461 };
  var adrCounts = { Total: 1285963 };
  describe('BBL', function(){
    testFunctions.allTests(dataset, { table: 'BBL' }, objIndexFunction, records, bblCounts, true);
  });
  describe('ADR', function(){
    testFunctions.allTests(dataset, { table: 'ADR' }, objIndexFunction, records, adrCounts, true, true);
  });
});
