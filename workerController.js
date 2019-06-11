const roleHarvester = require('role.harvester')
const roleBuilder = require('role.builder')
const roleHauler = require('role.hauler')
const roleDrone = require('role.drone')
const constructionManager = require('constructionManager')

const workerController = {
    clean: () => {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    generateName: (role) => `${role}-${Game.time}`,
    count: (role) => _.sum(Game.creeps, (creep) => creep.memory.role == role),
    run: () => {
        workerController.clean()
        const spawn = Game.spawns.Spawn1;
        const roomName = Object.keys(Game.rooms)[0];
        const room = Game.rooms[roomName];
        const energyCapacity = room.energyCapacityAvailable;
        const roomControllerLevel = room.controller.level;
        constructionManager.calculateNextBuilding(room);
        // Spawn logic
        if ((roomControllerLevel <= 2) && workerController.count('drone') < 8 || workerController.count('drone') < 4 ) {
            workerController.spawn(spawn, roleDrone, 200);
        }else if (roomControllerLevel > 1 && workerController.count('harvester') < room.find(FIND_SOURCES).length) {
            workerController.spawnHarvester(spawn, roleHarvester, energyCapacity, room);
        } else if (roomControllerLevel > 2 && workerController.count('hauler') < 2) {
            workerController.spawn(spawn, roleHauler, energyCapacity);
        } else if ((roomControllerLevel > 1) && workerController.count('builder') < 1 || workerController.count('builder') < 2 ) {
            workerController.spawn(spawn, roleBuilder, energyCapacity);
        }
        // Worker logic
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.role == 'drone') {
                roleDrone.run(creep)
            } else if (creep.memory.role == 'builder') {
                roleBuilder.run(creep)
            } else if (creep.memory.role == 'hauler') {
                roleHauler.run(creep)
            } else if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep)
            }
        }
    },
    spawn: (spawn, role, capacity, opts) => {
        const newName = workerController.generateName(role.name)
        const body = workerController.buildBody(role, capacity)
        var creep = spawn.spawnCreep(body, newName, { memory: Object.assign({}, { role: role.name }, opts) });
        return creep;
    },
    buildBody: (role, capacity) => {
        let baseBodyParts = role.body.baseBodyParts;
        let additionalBodyParts = role.body.additionalBodyParts;
        let body = baseBodyParts;
        var baseBodyPartsCost = _.reduce(baseBodyParts, (result, value) => {
            return result += BODYPART_COST[value];
        }, 0);
        var additionalBodyPartsCost = _.reduce(additionalBodyParts, (result, value) => {
            return result += BODYPART_COST[value];
        }, 0);
        let totalCost = baseBodyPartsCost;
        while (totalCost + additionalBodyPartsCost < capacity) {
            body = body.concat(additionalBodyParts);
            totalCost += additionalBodyPartsCost;
        }

        return body
    },
    spawnHarvester: (spawn, roleHarvester, energyCapacity, room) => {
        var sources = room.find(FIND_SOURCES);
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var availSources = _.reject(sources, (source) => _.contains(_.map(harvesters, 'memory.source'), source.id));
        workerController.spawn(spawn, roleHarvester, energyCapacity, { source: availSources[0].id });
    }
}

module.exports = workerController
