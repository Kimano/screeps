const gatherManager = require('gatherManager');
const energyGatherBehavior = require('energyGatherBehavior');

const energyCollectBehavior = {
    run: (creep) => {
        if (!creep.memory.gathering && creep.carry.energy === 0) {
            creep.memory.gathering = true;
        }

        if (creep.memory.gathering) {
            const tomb = gatherManager.getTombstoneToHarvest(creep);
            const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType === STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0
            })
            const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_CONTAINER
            })
            const energySource = tomb||container||storage;
            if(energySource) {
                var retCode = creep.withdraw(energySource, RESOURCE_ENERGY);
                switch (retCode) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(energySource);
                        break;
                    case ERR_FULL:
                        creep.memory.gathering = false
                        break;
                }
            } else {
                if(creep.memory.role !== "hauler") {
                    energyGatherBehavior.run(creep);
                }
            }
        }
    }
}

module.exports = energyCollectBehavior;