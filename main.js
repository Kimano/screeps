const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer')
const roleTower = require('role.tower')
const workerController = require('workerController')

module.exports.loop = function () {
  // Check for any tombstones
  const room = Object.keys(Game.rooms)[0]
  const tombstones = Game.rooms[room].find(FIND_TOMBSTONES)
  tombstones.forEach((t) => {
      const energy = t.store[RESOURCE_ENERGY]
      if (energy > 50) {
        const creep = t.pos.findClosestByPath(FIND_MY_CREEPS)
        if (creep !== null) {
          creep.memory.recovering = t
        }
      }
  })

  // Check friendly list
  if (!'friendlies' in Memory) {
    console.log('WARNING, no friendlies stored in memory!')
  } else {
    const towers = Game.rooms[room].find(FIND_MY_STRUCTURES, {
      filter: (s) => s.structureType === STRUCTURE_TOWER
    })
    towers.forEach((tower) => roleTower.run(tower))
  }

  workerController.run()

  if (Game.spawns['Spawn1'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    Game.spawns['Spawn1'].room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['Spawn1'].pos.x + 1,
        Game.spawns['Spawn1'].pos.y,
        {align: 'left', opacity: 0.8});
  }


}
