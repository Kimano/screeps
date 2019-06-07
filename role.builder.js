const roleUpgrader = require('role.upgrader')
const roleHarvester = require('role.harvester')

var roleBuilder = {
  requirements: {
    MOVE: .20,
    CARRY: .1,
    WORK: .5
  },
  bodyPriority: [MOVE, WORK],
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
    if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
    }
    if (creep.memory.building) {
      const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
      // let structures = creep.room.find(FIND_STRUCTURES)
      if (target !== null) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } })
        }
      } else {
        roleUpgrader.run(creep)
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

module.exports = roleBuilder;
