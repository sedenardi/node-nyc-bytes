var Bytes = require('../lib/bytes.js'),
    testFunctions = require('./testFunctions.js');

// describe('Pluto', function(){
//   var dataset = Bytes.Pluto;
//   var counts = { MN: 42958, BX: 89830, BK: 277131, QN: 324403, SI: 124048 };
//   testFunctions.allTests(dataset, { }, counts);
// });

describe('MapPluto', function(){
  var dataset = Bytes.MapPluto;
  var counts = { MN: 42697, BX: 89687, BK: 276930, QN: 324181, SI: 123721 };
  testFunctions.allTests(dataset, { }, counts);
});

// describe('ZoningTaxLot', function(){
//   var dataset = Bytes.ZoningTaxLot;
//   var counts = { MN: 42995, BX: 89798, BK: 277135, QN: 324346, SI: 124131 };
//   testFunctions.allTests(dataset, { }, counts);
// });
//
// describe('PAD', function(){
//   var dataset = Bytes.PAD;
//   var bblCounts = { Total: 880814 };
//   var adrCounts = { Total: 1292406 };
//   describe('BBL', function(){
//     testFunctions.allTests(dataset, { table: 'BBL' }, bblCounts, true);
//   });
//   describe('ADR', function(){
//     testFunctions.allTests(dataset, { table: 'ADR' }, adrCounts, true, true);
//   });
// });
