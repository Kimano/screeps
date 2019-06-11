const energyGatherBehavior = require('energyGatherBehavior')

var roleHarvester = {
    body: {
        baseBodyParts: [CARRY, WORK, WORK, MOVE],
        additionalBodyParts: [WORK]
    },
    name: 'harvester',
    run: (creep) => {
        if (creep.memory.gathering || creep.carry.energy === 0) {
            energyGatherBehavior.run(creep);
        } else {
            const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
            });
            if (container) {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
};

module.exports = roleHarvester;