const energyCollectBehavior = require('energyCollectBehavior')
const CONSTANTS = require('screepsConstants')
const constructionManager = require('constructionManager')

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
            if (creep.room.controller.ticksToDowngrade < 3000) {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: CONSTANTS.colors.upgrading } });
                }
            } else if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: CONSTANTS.colors.hauling, opacity: .5 } });
                }
            } else if (constructionManager.getConstructionSite(creep.room)) {
                var build = constructionManager.getConstructionSite(creep.room)
                if (creep.build(build) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(build, { visualizePathStyle: { stroke: CONSTANTS.colors.building } })
                }
            } else {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: CONSTANTS.colors.upgrading, opacity: .5 } });
                }
            }
        }
    }
};

module.exports = roleDrone;