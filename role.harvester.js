var roleHarvester = {
  requirements: {
    MOVE: .2,
    CARRY: .40,
    WORK: .40
  },
  bodyPriority: [MOVE, CARRY],
  run: (creep) => {
    if (creep.carry.energy === creep.carryCapacity) {
      creep.memory.harvesting = false
    } else if (creep.carry.energy === 0) {
      creep.memory.harvesting = true
    }
    if (creep.memory.harvesting && creep.carry.energy < creep.carryCapacity) {
      let sourceid = creep.memory.source
      if (sourceid === undefined) {
        let closest = creep.pos.findClosestByPath(FIND_SOURCES)
        if (closest === null) {
          closest = creep.room.find(FIND_SOURCES)[0]
        }
        creep.memory.source = closest.id
        sourceid = closest.id
      }
      const source = Game.getObjectById(sourceid)
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
      }
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
