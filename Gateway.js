const CONSTANTS = require('screepsConstants')

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
            var result = this.spawnCreep();
            if(result !== OK) {
                break;
            }
        }
    }

    spawnCreep() {
        var spawner = this.getSpawn();
        if(spawner) {
            var creepToSpawn = this.getNextInQueue();
            spawner.spawnCreep(creepToSpawn.body, "")
        }
        return -1;
    }

    getNextInQueue() {
        return this.spawnQueue.shift();
    }

    queueUnit(bodyType, opts) {
        var bodyCalced = this.calculateBody(bodyType);
        this.spawnQueue.push({
            body: bodyCalced,
            bodyType: bodyType,
            opts: opts
        });
    }

    getSpawn(spawn) {
        return this.availableSpawns.shift();
    }

    calculateBody(bodyProps) {
        var capacity = this.nexus.room.energyCapacityAvailable;
        let baseBodyParts = bodyProps.baseBodyParts;
        let additionalBodyParts = bodyProps.additionalBodyParts;
        let body = baseBodyParts;
        var baseBodyPartsCost = _.reduce(baseBodyParts, (result, value) => {
            return result += BODYPART_COST[value];
        }, 0);
        var additionalBodyPartsCost = _.reduce(additionalBodyParts, (result, value) => {
            return result += BODYPART_COST[value];
        }, 0);
        let totalCost = baseBodyPartsCost;
        while (totalCost + additionalBodyPartsCost < capacity) {
            body = body.concat(additionalBodyParts);
            totalCost += additionalBodyPartsCost;
        }

        return body
    }
};

module.exports = Gateway;