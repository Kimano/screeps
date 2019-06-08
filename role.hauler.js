const roleHauler = {
  requirements: {
    MOVE: .4,
    CARRY: .6
  },
  bodyPriority: [MOVE],
  name: 'hauler',
  run: (creep) => {
    if (creep.memory.hauling && creep.carry.energy == 0) {
      creep.memory.hauling = false
    }
    if (!creep.memory.hauling && creep.carry.energy == creep.carryCapacity) {
      creep.memory.hauling = true
    }
    if (creep.memory.hauling) {
      // Find the storage destination
      const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity
      })
      if (!storage) {
        console.log(`${creep.name} requires an empty storage to drop`)
        return
      }
      if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(storage, { visualizePath: {stroke: '#ffffff'}})
      }
    } else {
      // Find a container for more energy
      const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
      })
      if (!container) {
        console.log(`${creep.name} can't find container with energy`)
        if (!creep.memory.hauling) {
          creep.memory.hauling = true
          return
        }
      }
      if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(container)
      }
    }
  }
}

module.exports = roleHauler
