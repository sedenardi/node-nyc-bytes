/* global describe */

const Bytes = require('../lib/bytes.js');
const testFunctions = require('./testFunctions.js');

// describe('Pluto', () => {
//   var dataset = Bytes.Pluto;
//   var counts = { MN: 42958, BX: 89830, BK: 277131, QN: 324403, SI: 124048 };
//   testFunctions.allTests(dataset, { }, counts);
// });
//
// describe('MapPluto', function(){
//   var dataset = Bytes.MapPluto;
//   var counts = { MN: 42686, BX: 89685, BK: 276909, QN: 324168, SI: 123789 };
//   testFunctions.allTests(dataset, { }, counts);
// });

describe('ZoningTaxLot', function(){
  var dataset = Bytes.ZoningTaxLot;
  var counts = { MN: 42798, BX: 89713, BK: 276680, QN: 324297, SI: 124437 };
  testFunctions.allTests(dataset, { }, counts);
});

describe('PAD', function(){
  var dataset = Bytes.PAD;
  var bblCounts = { Total: 882259 };
  var adrCounts = { Total: 1311907 };
  describe('BBL', function(){
    testFunctions.allTests(dataset, { table: 'BBL' }, bblCounts, true);
  });
  describe('ADR', function(){
    testFunctions.allTests(dataset, { table: 'ADR' }, adrCounts, true, true);
  });
});
