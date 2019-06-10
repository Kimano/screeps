const gatherManager = require('gatherManager')

const energyGatherBehavior = {
    run: (creep) => {
        if (!creep.memory.gathering && creep.carry.energy === 0) {
            creep.memory.gathering = true;
        }

        if (creep.memory.gathering) {
            const tomb = gatherManager.getTombstoneToHarvest(creep);
            if(tomb) {
                var retCode = creep.withdraw(tomb, RESOURCE_ENERGY);
                switch (retCode) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(energySource);
                        break;
                    case ERR_FULL:
                        creep.memory.gathering = false
                        break;
                }
            } else {
                let sourceid = creep.memory.source
                const source = Game.getObjectById(sourceid);

                if (!source) {
                    var sources = creep.room.find(FIND_SOURCES);
                    creep.memory.source = sources[_.random(0, sources.length - 1)].id
                }

                var retCode = creep.harvest(source);
                switch (retCode) {
                    case OK:
                        if (creep.carry.energy == creep.carryCapacity) {
                            creep.memory.gathering = false
                        }
                        break;
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(source);
                        break;
                    case ERR_FULL:
                        creep.memory.gathering = false
                        break;
                }
            }
        }
    }
}

module.exports = energyGatherBehavior;