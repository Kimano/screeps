const CONSTANTS = require('screepsConstants')
const constructionManager = require('constructionManager')
const energyCollectBehavior = require('energyCollectBehavior')

var roleBuilder = {
    body: {
        baseBodyParts: [CARRY, WORK, MOVE],
        additionalBodyParts: [WORK,CARRY,MOVE]
    },
    name: 'builder',
    run: (creep) => {
        if (creep.memory.gathering || creep.carry.energy === 0) {
            energyCollectBehavior.run(creep);
        } else {
            var action = false;
            if (creep.room.controller.ticksToDowngrade < 3000) {
                action = true;
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: CONSTANTS.colors.upgrading } });
                }
            }
            if (!action) {
                const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {
                        return s.hits < s.hitsMax / 2 && s.structureType !== STRUCTURE_WALL
                    }
                })
                if (structure) {
                    action = true;
                    if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure)
                    }
                }
            }
            if (!action) {
                var target = constructionManager.getConstructionSite(creep.room);
                if (target) {
                    action = true;
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: CONSTANTS.colors.building } })
                    }
                }
            }
            if (!action) {
                var extension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity
                });
                var spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
                    filter: (s) => s.energy < s.energyCapacity
                });
                var target = spawn || extension;
                if (target) {
                    action = true;
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePath: { stroke: CONSTANTS.colors.hauling } });
                    }
                }
            }
            if (!action) {
                action = true;
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: CONSTANTS.colors.upgrading } });
                }
            }
        }
    }
};

module.exports = roleBuilder;
