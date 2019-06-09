const energyGatherBehavior = require('energyGatherBehavior')

var roleHarvester = {
  requirements: {
    MOVE: .3,
    CARRY: .20,
    WORK: .50
  },
  bodyPriority: [MOVE, WORK],
  name: 'harvester',
  run: (creep) => {
    if(creep.memory.gathering || creep.carry.energy === 0) {
      energyGatherBehavior.run(creep);
    } else {
      creep.memory.source = undefined
      let target = null
      const spawner = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => 'energyCapacity' in structure && structure.energy < structure.energyCapacity
      })
      const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => 'store' in structure && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
      });
      if (spawner !== null) {
        target = spawner
      } else if (container !== null) {
        target = container
      }
      if (target !== null) {
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

module.exports = roleHarvester;
