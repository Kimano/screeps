const CONSTANTS = require('screepsConstants')
const Purpose = require('Purpose')

class SpawnPurpose extends Purpose{
    constructor(gateway) {
        super(gateway);
        this.gateway = gateway;
    }

    preRun() {

    }

    run() {
        console.log("Spawn Purpose Run");
    }
};

module.exports = SpawnPurpose;