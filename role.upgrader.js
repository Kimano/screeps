const roleHarvester = require('role.harvester')

var roleUpgrader = {
  requirements: {
    MOVE: .20,
    CARRY: .10,
    WORK: .40
  },
  bodyPriority: [MOVE, WORK],
  name: 'upgrader',
  run: (creep) => {
    if ('recovering' in creep) {
      const tomb = creep.memory.recovering
      const resp = creep.withdraw(tomb, RESOURCE_ENERGY)
      if (resp === OK) {
        delete creep.memory.recovering
      } else if (resp === ERR_NOT_IN_RANGE) {
        creep.moveTo(tomb)
      }
    }
    if (creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    } else {
      const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0
      })
      if (container === null) {
        roleHarvester.run(creep)
      } else {
        if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(container)
        }
      }
    }
  }
};

module.exports = roleUpgrader;
