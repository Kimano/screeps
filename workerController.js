const roleHarvester = require('role.harvester')
const roleBuilder = require('role.builder')
const roleUpgrader = require('role.upgrader')
const roleRepairer = require('role.repairer')

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
    const newName = workerController.generateName(role)
    const body = workerController.buildBody(roleHarvester.requirements, roleHarvester.bodyPriority, capacity)
    return spawn.createCreep(body, newName, { role: role })
  },
  recover: (creep, tomb) => {
    console.log(creep.name, 'is recovering', tomb.id)
    const resp = creep.withdraw(tomb, RESOURCE_ENERGY)
    if (resp === OK) {
      delete creep.memory.recovering
    } else if (resp === ERR_NOT_IN_RANGE) {
      creep.moveTo(tomb)
    }
  },
  run: () => {
    workerController.clean()
    const spawn = Game.spawns.Spawn1
    const roomName = Object.keys(Game.rooms)[0]
    const room = Game.rooms[roomName]
    const energyCapacity = room.energyCapacityAvailable
    // Spawn logic
    if (workerController.count('harvester') < 5) {
      workerController.spawn(spawn, 'harvester', energyCapacity)
    } else if (workerController.count('upgrader') < 2) {
      workerController.spawn(spawn, 'upgrader', energyCapacity)
    } else if (workerController.count('builder') < 3) {
      workerController.spawn(spawn, 'builder', energyCapacity)
    } else if (workerController.count('repairer') < 1) {
      workerController.spawn(spawn, 'repairer', energyCapacity)
    }
    // Worker logic
    const tombstones = room.find(FIND_TOMBSTONES)
    tombstones.forEach((t) => {
      const energy = t.store[RESOURCE_ENERGY]
      if (energy > 25) {
        const creep = t.pos.findClosestByPath(FIND_MY_CREEPS)
        if (creep !== null) {
          creep.memory.recovering = t.id
          workerController.recover(creep, t)
        }
      }
    })
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if ('recovering' in creep) {
        console.log(name, 'is recovering, skipping')
        // Already got a task so skipping
        continue
      }
      if (creep.memory.role == 'harvester') {
        roleHarvester.run(creep);
      } else if (creep.memory.role == 'upgrader') {
        roleUpgrader.run(creep);
      } else if (creep.memory.role == 'repairer') {
        roleRepairer.run(creep);
      } else if (creep.memory.role == 'builder') {
        roleBuilder.run(creep);
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
