const CONSTANTS = require('screepsConstants')
const UnitSetup = require('UnitSetup')

class Gateway {
    spawns = [];

    init(nexus) {
        this.init = true;
        this.nexus = nexus;
        this.spawns = this.nexus.room.find(FIND_MY_SPAWNS);
        this.availableSpawns = [].concat(this.spawns);
        this.spawnQueue = [];
    }
    preRun() {
        
    }

    run() {
        while(this.availableSpawns.length > 0) {
            var creep = this.availableSpawns.shift();
            var result = this.spawnCreep(creep);
            if(result !== OK) {
                this.availableSpawns.unshift(creep);
                break;
            }
        }
    }

    spawnCreep() {
        var spawner = this.getSpawn();
        if(spawner) {
            var creepToSpawn = this.getNextInQueue();
            var code = spawner.spawnCreep(creepToSpawn.bodySetup, creepToSpawn.name, this.getEnergyCapacity());
        }
        return -1;
    }

    getNextInQueue() {
        return this.spawnQueue.shift();
    }

    queueUnit(role) {
        this.spawnQueue.push(new UnitSetup(role));
    }

    getSpawn(spawn) {
        return this.availableSpawns.shift();
    }

    getEnergyCapacity() {
        return this.room.energyCapacityAvailable;
    }
};

module.exports = Gateway;