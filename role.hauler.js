const CONSTANTS = require('screepsConstants')
const energyGatherBehavior = require('energyGatherBehavior')
const energyCollectBehavior = require('energyCollectBehavior')

const roleHauler = {
    body: {
        baseBodyParts: [CARRY, CARRY, MOVE],
        additionalBodyParts: [CARRY,CARRY,MOVE]
    },
    name: 'hauler',
    run: (creep) => {
        if (creep.memory.gathering || creep.carry.energy === 0) {
            energyCollectBehavior.run(creep);
        } else {
            // Find the storage destination
            var extension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity
            });
            var storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity
            });
            var spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
                filter: (s) => s.energy < s.energyCapacity
            });
            var target = spawn || extension || storage;
            if(target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePath: { stroke: CONSTANTS.colors.hauling } });
                }
            }
        }
    }
}

module.exports = roleHauler
