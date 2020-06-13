/* global describe */

const Bytes = require('../lib/bytes.js');
const testFunctions = require('./testFunctions.js');

const records = {
  MN: ['1000010010', '1004370018', '1011990044', '1019030041', '1020870091', 'fake'],
  BX: ['2024210033', '2029550018', '2037850010', '2045930006', '2056310011', 'fake'],
  BK: ['3000010001', '3017800069', '3048500041', '3066700043', '3088180014', 'fake'],
  QN: ['4000060001', '4027730050', '4070210131', '4110440047', '4161110043', 'fake'],
  SI: ['5000010010', '5016150074', '5032520045', '5051560055', '5078180009', 'fake']
};

const objBBLFunction = function(record) {
  return record.bbl || record.BBL;
};

const geoBBLFunction = function(record) {
  return record.properties.BBL.toString();
};

describe('Pluto', () => {
  const dataset = Bytes.Pluto;
  const counts = { Total: 858979 };
  testFunctions.allTests(dataset, { }, records, objBBLFunction, counts, true);
});

describe('MapPluto', () => {
  const dataset = Bytes.MapPluto;
  const counts = { Total: 857172 };
  testFunctions.allTests(dataset, { }, records, geoBBLFunction, counts, true);
});

describe('ZoningTaxLot', () => {
  const dataset = Bytes.ZoningTaxLot;
  const counts = { Total: 858407 };
  testFunctions.allTests(dataset, { }, records, objBBLFunction, counts, true);
});

describe('PAD', () => {
  const dataset = Bytes.PAD;
  const bblCounts = { Total: 874320 };
  const adrCounts = { Total: 1313708 };
  describe('BBL', () => {
    testFunctions.allTests(dataset, { table: 'BBL' }, records, objBBLFunction, bblCounts, true);
  });
  describe('ADR', () => {
    testFunctions.allTests(dataset, { table: 'ADR' }, records, objBBLFunction, adrCounts, true, true);
  });
});
