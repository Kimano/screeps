const CONSTANTS = require('screepsConstants')
const UnitSetup = require('UnitSetup')
const SpawnPurpose = require('SpawnPurpose')

class Gateway {
    spawns = [];
    constructor(nexus) {
        this.nexus = nexus;
        this.spawns = this.nexus.room.find(FIND_MY_SPAWNS);
        this.availableSpawns = [].concat(this.spawns);
        this.spawnQueue = [];
        this.purpose = new SpawnPurpose(this);
        this.nexus.Executor.registerPurpose(this.purpose);
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

    getQueuedUnitsByRole(role) {
        return _.filter(this.spawnQueue, (setup) => setup.getRole() === role);
    }
};

module.exports = Gateway;