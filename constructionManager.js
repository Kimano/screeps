const CONSTANTS = require('screepsConstants')


const extensionsMap = [
    [3, 1], [3, 2], [4, 2], [4, 3], [5, 3], [5, 4], [6, 4],
    [1, 3], [3, 2], [2, 4], [3, 4], [3, 5], [4, 5], [4, 6], [1, 5]
];
const extensionOrder = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
const labs = [
    [5, 0], [7, 0],
    [5, -1], [6, -1], [6, -2], [7, -2],
    [5, 1], [6, 1], [6, 2], [7, 2]
];
const backupExtensions = [
    [-1, -6], [-2, -6], [-2, -7], [1, -6], [2, -6], [2, -7], [-1, 6], [-2, 6], [-2, 7], [1, 6], [2, 6], [2, 7]
];
const backupLabs = [
    [-5, -1], [-6, -1], [-6, -2], [-7, -2], [-5, 1], [-6, 1], [-6, 2], [-7, 2]
];

const constructionManager = {
    getQueue: () => {
        if (!Memory.buildQueue) {
            Memory.buildQueue = [];
        }
        return Memory.buildQueue;
    },

    popBuildQueue: () => {
        var queue = constructionManager.getQueue();
        if (queue.length > 0) {
            var build = queue.pop();
            var room = Game.rooms[build[2]];
            var pos = new RoomPosition(build[0], build[1], build[2]);
            var code = room.createConstructionSite(pos, build[3]);
            if(code === ERR_FULL) queue.push(build);
        }
    },

    pushBuildQueue: (pos, structureType) => {
        var queue = constructionManager.getQueue();
        queue.push([pos.x, pos.y, pos.roomName, structureType]);
    },

    getConstructionSite: (room) => {
        let sites = room.find(FIND_CONSTRUCTION_SITES);
        if (sites.length > 0) {
            var sortedSites = _.sortBy(sites, [
                function (site) {
                    return CONSTANTS.structures_peacetime_priority[site.structureType];
                },
                function (site) {
                    return site.progress / site.progressTotal;
                },
                function (site) {
                    switch (room.Terrain.get(site.pos.x, site.pos.y)) {
                        default:
                        case 0: // Plains
                            return 2;
                        case 1: // Wall
                            return 3;
                        case 2: //Swamp
                            return 1;
                    }
                }
            ])
            return _.find(sites, function (site) {
                return site.structureType === STRUCTURE_ROAD && _.find(site.room.lookAt(site.pos), { type: "terrain", terrain: "swamp" })
            }) || sortedSites[0]
        }
    },

    calculateNextBuilding: (room) => {
        var self = constructionManager;
        if (!Memory.hasBuiltShell) Memory.hasBuiltShell = {};
        if (!Memory.hasBuiltShell[room.name]) Memory.hasBuiltShell[room.name] = [];
        var shellArray = Memory.hasBuiltShell[room.name];
        var rcl = room.controller.level;
        if (!shellArray[rcl]) {
            self.constructShell(room);
            shellArray[rcl] = true;
        }
        let sites = room.find(FIND_CONSTRUCTION_SITES);
        for (var i = sites.length; i < 100; i++) {
            self.popBuildQueue();
        }
    },

    constructShell: (room) => {
        var self = constructionManager;
        var controller = room.controller;
        var flag = room.find(FIND_FLAGS, {
            filter: { name: "roomTopSpawn" }
        })[0];
        var backupCount = 0;
        var centerPos = new RoomPosition(flag.pos.x, flag.pos.y + 1, flag.pos.roomName);
        if (flag) {
            var roomLevel = controller.level;
            switch (roomLevel) {
                case 4:
                    //Construct Storage
                    self.pushBuildQueue(new RoomPosition(centerPos.x - 1, centerPos.y - 1, centerPos.roomName), STRUCTURE_STORAGE);
                case 3:
                    // Construct Circles
                    self.buildCircle(room, centerPos, 2, STRUCTURE_ROAD, { buildOnWall: false });
                    self.buildCircle(room, centerPos, 8, STRUCTURE_ROAD, { buildOnWall: false });

                    // Construct Straight Center Spokes
                    _.each([TOP, BOTTOM, LEFT, RIGHT], (dir) => {
                        self.buildLine(room, centerPos, 8, STRUCTURE_ROAD, { buildOnWall: false, direction: dir, offset: 2, queue: true });
                    });
                    // Construct Diagonal Center Spokes
                    for (var i = 2; i < 6; i++) {
                        self.buildCorners(room, centerPos, i, STRUCTURE_ROAD, { buildOnWall: false, ignoreStructures: true, queue: true });
                    }
                    // Construct Peripheral Spokes
                    for (var i = 1; i <= 4; i++) {
                        self.buildCorners(room, new RoomPosition(centerPos.x, centerPos.y - 3, centerPos.roomName), i, STRUCTURE_ROAD, { buildOnWall: false, queue: true });
                    }
                    for (var i = 1; i <= 4; i++) {
                        self.buildCorners(room, new RoomPosition(centerPos.x, centerPos.y + 3, centerPos.roomName), i, STRUCTURE_ROAD, { buildOnWall: false, queue: true });
                    }
                    for (var i = 1; i <= 4; i++) {
                        self.buildCorners(room, new RoomPosition(centerPos.x - 3, centerPos.y, centerPos.roomName), i, STRUCTURE_ROAD, { buildOnWall: false, queue: true });
                    }
                    for (var i = 1; i <= 4; i++) {
                        self.buildCorners(room, new RoomPosition(centerPos.x + 3, centerPos.y, centerPos.roomName), i, STRUCTURE_ROAD, { buildOnWall: false, queue: true });
                    }
                    //Construct End Spoke Diagonals
                    self.pushBuildQueue(new RoomPosition(centerPos.x + 1, centerPos.y + 7, centerPos.roomName), structureType);
                    self.pushBuildQueue(new RoomPosition(centerPos.x - 1, centerPos.y + 7, centerPos.roomName), structureType);
                    self.pushBuildQueue(new RoomPosition(centerPos.x + 1, centerPos.y - 7, centerPos.roomName), structureType);
                    self.pushBuildQueue(new RoomPosition(centerPos.x - 1, centerPos.y - 7, centerPos.roomName), structureType);
                    self.pushBuildQueue(new RoomPosition(centerPos.x + 7, centerPos.y + 1, centerPos.roomName), structureType);
                    self.pushBuildQueue(new RoomPosition(centerPos.x - 7, centerPos.y + 1, centerPos.roomName), structureType);
                    self.pushBuildQueue(new RoomPosition(centerPos.x + 7, centerPos.y - 1, centerPos.roomName), structureType);
                    self.pushBuildQueue(new RoomPosition(centerPos.x - 7, centerPos.y - 1, centerPos.roomName), structureType);

                    //Construct Tower
                    self.pushBuildQueue(new RoomPosition(centerPos.x - 1, centerPos.y, centerPos.roomName), STRUCTURE_TOWER);
                case 2:
                    var currentContainerCount = room.find(FIND_STRUCTURES, {
                        filter: { structureType: STRUCTURE_CONTAINER }
                    }).length
                    if (currentContainerCount < room.find(FIND_SOURCES).length) {
                        _.forEach(sources, function (source) {
                            constructionManager.buildCorners(room, source.pos, 1, STRUCTURE_CONTAINER, { buildOnWall: false, count: 1 })
                        });
                    }
                default:
                case 1:
                    //Construct Extensions
                    const extensionsCap = CONSTANTS.extensions_per_RCL[room.controller.level];
                    var currentExtensionCount = room.find(FIND_STRUCTURES, {
                        filter: { structureType: STRUCTURE_EXTENSION }
                    }).length;
                    for (var queuedExtensions = 0; queuedExtensions + currentExtensionCount < extensionsCap; queuedExtensions++) {
                        for (var j = 0; j < extensionOrder.length - 1 && queuedExtensions + currentExtensionCount < extensionsCap; j++) {
                            for (var k = 0; k < extensionsMap.length - 1 && queuedExtensions + currentExtensionCount < extensionsCap; k++) {
                                var offset = [(extensionOrder[j][0] * extensionsMap[k][0]), (extensionOrder[j][1] * extensionsMap[k][1])];
                                var pos = new RoomPosition(centerPos.x + offset[0], centerPos.y + offset[1], centerPos.roomName);
                                if (room.getTerrain().get(pos.x, pos.y) !== TERRAIN_MASK_WALL) {
                                    self.pushBuildQueue(pos, STRUCTURE_EXTENSION);
                                    queuedExtensions += 1;
                                }
                            }
                        }
                    }
                    if (queuedExtensions + currentExtensionCount < extensionsCap) {
                        // Backup Extensions here
                    }
                    break;
            }
        }

        // var spawn = room.find(FIND_MY_SPAWNS)[0];
        // var sources = room.find(FIND_SOURCES);

        // _.forEach(room.findPath(controller.pos, spawn.pos, { ignoreCreeps: true, ignoreRoads: false }), (posObj) => {
        //     room.createConstructionSite(posObj.x, posObj.y, STRUCTURE_ROAD);
        // });

        // _.forEach(sources, function (source) {
        //     constructionManager.buildCircle(room, source.pos, 1, STRUCTURE_ROAD, { buildOnWall: false });
        //     constructionManager.buildCircle(room, source.pos, 2, STRUCTURE_ROAD, { buildOnWall: false });
        // });
    },

    buildCircle: (room, position, radius, structureType, opts) => {
        var self = constructionManager;
        var buildOnWall = (opts && opts.buildOnWall) || false;
        var count = (opts && opts.count) ? opts.count : Number.MAX_SAFE_INTEGER;
        var ignoreStructures = (opts && opts.ignoreStructures) || false;
        var queue = (opts && opts.queue) || false;

        var d = 3 - (2 * radius);
        var x = 0;
        var y = radius;
        do {
            var pos;
            pos = new RoomPosition(position.x + x, position.y + y, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
            pos = new RoomPosition(position.x + x, position.y - y, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
            pos = new RoomPosition(position.x - x, position.y + y, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
            pos = new RoomPosition(position.x - x, position.y - y, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);

            pos = new RoomPosition(position.x + y, position.y + x, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
            pos = new RoomPosition(position.x + y, position.y - x, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
            pos = new RoomPosition(position.x - y, position.y + x, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
            pos = new RoomPosition(position.x - y, position.y - x, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
            if (d < 0) {
                d = d + (4 * x) + 6;
            } else {
                d = d + 4 * (x - y) + 10;
                y--;
            }
            x++;
        } while (x <= y);
    },

    buildCorners: (room, position, radius, structureType, opts) => {
        var self = constructionManager;
        var buildOnWall = (opts && opts.buildOnWall) || false;
        var count = (opts && opts.count) ? opts.count : Number.MAX_SAFE_INTEGER;
        var ignoreStructures = (opts && opts.ignoreStructures) || false;
        var queue = (opts && opts.queue) || false;

        var pos;
        pos = new RoomPosition(position.x + radius, position.y + radius, position.roomName);
        if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
        pos = new RoomPosition(position.x + radius, position.y - radius, position.roomName);
        if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
        pos = new RoomPosition(position.x - radius, position.y + radius, position.roomName);
        if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
        pos = new RoomPosition(position.x - radius, position.y - radius, position.roomName);
        if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
    },

    buildLine: (room, position, radius, structureType, opts) => {
        var self = constructionManager;
        var buildOnWall = (opts && opts.buildOnWall) || false;
        var count = (opts && opts.count) ? opts.count : Number.MAX_SAFE_INTEGER;
        var ignoreStructures = (opts && opts.ignoreStructures) || false;
        var direction = (opts && opts.direction);
        var offset = (opts && opts.offset) || 0;
        var queue = (opts && opts.queue) || false;

        for (var i = offset; i < radius; i++) {
            switch (direction) {
                case LEFT:
                    var pos = new RoomPosition(position.x + i, position.y, position.roomName);
                    if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
                    break;
                case RIGHT:
                    var pos = new RoomPosition(position.x - i, position.y, position.roomName);
                    if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
                    break;
                case TOP:
                    var pos = new RoomPosition(position.x, position.y + i, position.roomName);
                    if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
                    break;
                default:
                case BOTTOM:
                    var pos = new RoomPosition(position.x, position.y - i, position.roomName);
                    if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) (queue) ? self.pushBuildQueue(pos, structureType) : room.createConstructionSite(pos, structureType);
                    break;
            }
        }
    },

    isWall: (room, pos) => {
        return _.find(room.lookAt(pos), { type: "terrain", terrain: "wall" });
    },

    isStructure: (room, pos) => {
        return _.find(room.lookAt(pos), { type: LOOK_CONSTRUCTION_SITES }) || _.find(room.lookAt(pos), { type: LOOK_STRUCTURES });
    }
}

module.exports = constructionManager;