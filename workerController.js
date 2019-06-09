const roleHarvester = require('role.harvester')
const roleBuilder = require('role.builder')
const roleHauler = require('role.hauler')

const workerController = {
  clean: () => {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        for (let s in Memory.sources) {
          if (s.harvesters.includes(name)) {
            console.log('Removing harvester from source', s.id, name)
            s.harvesters.splice(s.harvesters.indexOf(name), 1)
          }
        }
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  },
  count: (role) => _.sum(Game.creeps, (creep) => creep.memory.role == role),
  generateName: (role) => `${role}-${Game.time}`,
  spawn: (spawn, role, capacity) => {
    const newName = workerController.generateName(role.name)
    const body = workerController.buildBody(role.requirements, role.bodyPriority, capacity)
    return spawn.createCreep(body, newName, { role: role.name })
  },
  run: () => {
    workerController.clean()
    const spawn = Game.spawns.Spawn1
    const roomName = Object.keys(Game.rooms)[0]
    const room = Game.rooms[roomName]
    const energyCapacity = room.energyCapacityAvailable
    // Spawn logic
    if (workerController.count('harvester') < 5) {
      workerController.spawn(spawn, roleHarvester, energyCapacity)
    } else if (workerController.count('builder') < 5) {
      workerController.spawn(spawn, roleBuilder, energyCapacity)
    } else if (room.storage && workerController.count('hauler') < 1) {
      workerController.spawn(spawn, roleHauler, energyCapacity)
    }
    // Worker logic
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (creep.memory.role == 'harvester') {
        roleHarvester.run(creep)
      } else if (creep.memory.role == 'builder') {
        roleBuilder.run(creep)
      } else if (creep.memory.role == 'hauler') {
        roleHauler.run(creep)
      }
    }
  },
  buildBody: (requirements, priority, capacity) => {
    let body = []
    let totalCost = 0
    for (const partCode in requirements) {
      const part = eval(partCode)
      const percentage = requirements[partCode]
      const cost = BODYPART_COST[part]
      let count = (capacity / cost * percentage)
      if (count < 1) {
        count = 1
      } else {
        count = Math.floor(count)
      }
      for (let i = 0; i < count; i++) {
        body.push(part)
        totalCost += cost
      }
    }
    let additions = true
    while (additions) {
      additions = false
      priority.forEach((part) => {
        const cost = BODYPART_COST[part]
        if (totalCost + cost <= capacity) {
          additions = true
          body.push(part)
          totalCost += cost
        }
      })
    }
    // console.log(body, capacity, totalCost)
    return body
  }
}

module.exports = workerController
