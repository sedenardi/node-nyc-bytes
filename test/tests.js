/* global describe */

const Bytes = require('../lib/bytes.js');
const testFunctions = require('./testFunctions.js');

describe('Pluto', () => {
  const dataset = Bytes.Pluto;
  const counts = { MN: 42966, BX: 89854, BK: 277316, QN: 324583, SI: 124493 };
  testFunctions.allTests(dataset, { }, counts);
});

describe('MapPluto', () => {
  const dataset = Bytes.MapPluto;
  const counts = { MN: 42556, BX: 89632, BK: 276715, QN: 324236, SI: 124397 };
  testFunctions.allTests(dataset, { }, counts);
});

describe('ZoningTaxLot', () => {
  const dataset = Bytes.ZoningTaxLot;
  const counts = { MN: 42798, BX: 89713, BK: 276680, QN: 324297, SI: 124437 };
  testFunctions.allTests(dataset, { }, counts);
});

describe('PAD', () => {
  const dataset = Bytes.PAD;
  const bblCounts = { Total: 882259 };
  const adrCounts = { Total: 1311907 };
  describe('BBL', () => {
    testFunctions.allTests(dataset, { table: 'BBL' }, bblCounts, true);
  });
  describe('ADR', () => {
    testFunctions.allTests(dataset, { table: 'ADR' }, adrCounts, true, true);
  });
});
