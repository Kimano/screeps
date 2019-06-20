const CONSTANTS = require('screepsConstants')
const UnitSetup = require('UnitSetup')
const SpawnPurpose = require('SpawnPurpose')

class Gateway {
    constructor(nexus) {
        this.nexus = nexus;
        this.spawns = this.nexus.room.find(FIND_MY_SPAWNS);
        this.availableSpawns = [].concat(this.spawns);
        this.purpose = new SpawnPurpose(this);
        this.nexus.executor.registerPurpose(this.purpose);
    }

    preRun() {
        
    }

    run() {
        // console.log("Gateway run()")
    }

    getSpawn() {
        return this.availableSpawns.shift();
    }

    hasAvailableSpawns() {
        return this.availableSpawns.length > 0;
    }

    returnSpawn(spawn) {
        this.availableSpawns.unshift(spawn);
    }

    getEnergyCapacity() {
        return this.room.energyCapacityAvailable;
    }

    getNextInQueue() {
        return this.purpose.getNextInQueue();
    }

    queueUnitSetup(setup) {
        this.purpose.queueUnitSetup(setup);
    }
};

module.exports = Gateway;