const roleTower = require('role.tower')
const workerController = require('workerController')
var Conclave = require('Conclave')

module.exports.loop = function () {
    var oldCode = false;
    if(oldCode) {
        const room = Object.keys(Game.rooms)[0]

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
            { align: 'left', opacity: 0.8 });
        }
    } else {
        // if(!Conclave || !Conclave.init) {
        //     delete global.Conclave;
        //     global.Conclave = new Conclave();
            Conclave.init();
        // }
        Conclave.preRun();
        Conclave.run();
    }

}
