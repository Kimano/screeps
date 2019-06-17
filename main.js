var Conclave = require('Conclave')
var Traveler = require('Traveler');

module.exports.loop = function () {
    var conclave = new Conclave();
    conclave.preRun();
    conclave.run();
}
