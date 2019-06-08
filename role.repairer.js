const roleBuilder = require('role.builder')
const roleHarvester = require('role.harvester')

var roleRepairer = {
  requirements: {
    MOVE: .45,
    CARRY: .1,
    WORK: .45
  },
  bodyPriority: [MOVE, WORK],
  name: 'repairer',
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
    if (creep.memory.repairing && creep.carry.energy == 0) {
      creep.memory.repairing = false
    }
    if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
      creep.memory.repairing = true
    }
    if (creep.memory.repairing) {
      const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
          return s.hits < s.hitsMax / 2 && s.structureType !== STRUCTURE_WALL
        }
      })
      if (structure !== null) {
        if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
          creep.moveTo(structure)
        }
      } else {
        roleBuilder.run(creep)
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

module.exports = roleRepairer;
