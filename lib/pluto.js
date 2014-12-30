var dataset = require('../datasets.json').pluto;

var Pluto = function() {
  this.dataset = dataset;
};
Pluto.prototype.getUrl= function() {
  return this.dataset.url;
};

module.exports = new Pluto();