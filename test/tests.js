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
  var counts = { MN: 43169, BX: 89840, BK: 277563, QN: 324530, SI: 123812 };
  testFunctions.allTests(dataset, { }, objIndexFunction, records, counts);
});

describe('MapPluto', function(){
  var dataset = Bytes.MapPluto;
  var counts = { MN: 42851, BX: 89684, BK: 277211, QN: 324229, SI: 123538 };
  testFunctions.allTests(dataset, { }, geoIndexFunction, records, counts);
});

describe('ZoningTaxLot', function(){
  var dataset = Bytes.ZoningTaxLot;
  var counts = { MN: 43175, BX: 89811, BK: 277523, QN: 324450, SI: 123822 };
  testFunctions.allTests(dataset, { }, objIndexFunction, records, counts);
});

describe('PAD', function(){
  var dataset = Bytes.PAD;
  var bblCounts = { MN: 46951, BX: 91688, BK: 283151, QN: 328809, SI: 129941 };
  var adrCounts = { MN: 66296, BX: 133948, BK: 389610, QN: 506394, SI: 172321 };
  describe('BBL', function(){
    testFunctions.allTests(dataset, { table: 'BBL' }, objIndexFunction, records, bblCounts, true);
  });
  describe('ADR', function(){
    testFunctions.allTests(dataset, { table: 'ADR' }, objIndexFunction, records, adrCounts, true, true);
  });
  describe('BOTH', function(){
    var bothCounts = { MN: bblCounts.MN + adrCounts.MN,
      BX: bblCounts.BX + adrCounts.BX, BK: bblCounts.BK + adrCounts.BK,
      QN: bblCounts.QN + adrCounts.QN, SI: bblCounts.SI + adrCounts.SI
    }
    testFunctions.allTests(dataset, { }, objIndexFunction, records, bothCounts, true, true);
  });
});