const CONSTANTS = require('screepsConstants')
const energyGatherBehavior = require('energyGatherBehavior')

const roleHauler = {
  requirements: {
    MOVE: .4,
    CARRY: .6
  },
  bodyPriority: [MOVE],
  name: 'hauler',
  run: (creep) => {
    if(creep.memory.gathering || creep.carry.energy === 0) {
      energyGatherBehavior.run(creep);
    } else {
      // Find the storage destination
      const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity
      })
      if (!storage) {
        console.log(`${creep.name} requires an empty storage to drop`)
        return
      }
      if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(storage, { visualizePath: {stroke: CONSTANTS.colors.hauling}})
      }
    }
  }
}

module.exports = roleHauler
