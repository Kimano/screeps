const roleHarvester = require('role.harvester')
const CONSTANTS = require('screepsConstants')
const constructionManager = require('constructionManager')
const energyGatherBehavior = require('energyGatherBehavior')

var roleBuilder = {
  requirements: {
    MOVE: .20,
    CARRY: .1,
    WORK: .5
  },
  bodyPriority: [MOVE, WORK],
  name: 'builder',
  run: (creep) => {
    if (creep.memory.gathering || creep.carry.energy === 0) {
      energyGatherBehavior.run(creep);
    } else {
      var action = false;
      if (!action) {
        const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => {
            return s.hits < s.hitsMax / 2 && s.structureType !== STRUCTURE_WALL
          }
        })
        if (structure !== null) {
          action = true;
          if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
            creep.moveTo(structure)
          }
        }
      }
      if (!action) {
        var target = constructionManager.getConstructionSite(creep.room);
        if (target !== null) {
          action = true;
          if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: CONSTANTS.colors.building } })
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
