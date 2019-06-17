const CONSTANTS = require('screepsConstants')
const UnitSetup = require('UnitSetup')

class SpawnPurpose {
    constructor(gateway) {
        // super(gateway);
        this.gateway = gateway;
        this.spawnQueue = [];
    }

    preRun() {

    }

    run() {
        // console.log("SpawnPurpose run()")
        while(this.gateway.hasAvailableSpawns()) {
            var spawn = this.gateway.getSpawn();
            var creep = this.getNextInQueue();
            var result = this.spawnCreep(spawn, creep);
            if(result !== OK) {
                this.gateway.returnSpawn(creep);
                break;
            }
        }
    }

    getNextInQueue() {
        return this.spawnQueue.shift();
    }

    spawnCreep(spawn, creep) {
        if(spawn && creep) {
            var code = spawn.spawnCreep(creep.bodySetup, creep.name, {memory: creep.getMemory()});
        }
        return code;
    }

    queueUnitSetup(role) {
        this.spawnQueue.push(role);
    }
};

module.exports = SpawnPurpose;