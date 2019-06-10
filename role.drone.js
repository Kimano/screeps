const energyCollectBehavior = require('energyCollectBehavior')

var roleDrone = {
    body: {
        baseBodyParts: [WORK, CARRY, MOVE],
        additionalBodyParts: []
    },
    name: 'drone',
    run: (creep) => {
        if (creep.memory.gathering || creep.carry.energy === 0) {
            energyCollectBehavior.run(creep);
        } else {
            creep.memory.source = undefined
            const spawner = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
                filter: (s) => s.energy < s.energyCapacity
            });
            const extension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity
            });
            var target = spawner || extension;
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
};

module.exports = roleDrone;