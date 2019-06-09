const CONSTANTS = require('screepsConstants')

const constructionManager = {
    getConstructionSite: (room) => {
        if (!Memory.hasBuiltShell) Memory.hasBuiltShell = {};
        if (!Memory.hasBuiltShell[room.name]) {
            Memory.hasBuiltShell[room.name] = true;
            constructionManager.constructShell(room);
        }
        let sites = room.find(FIND_CONSTRUCTION_SITES
            // , {filter: (site) => { site.my }}
        );
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
    },

    calculateNextBuilding: (room) => {
        let sites = room.find(FIND_CONSTRUCTION_SITES);
        const extensions = room.find(FIND_STRUCTURES, { filter: (structure) => { structure.structureType === STRUCTURE_EXTENSION } }).length + room.find(FIND_CONSTRUCTION_SITES, { filter: (site) => { site.structureType === STRUCTURE_EXTENSION } }).length
        if (extensions < CONSTANTS.extenstions_per_RCL[room.controller.level]) {
            return STRUCTURE_EXTENSION;
        }
        if (!room.storage) {
            return STRUCTURE_STORAGE
        }
    },

    constructShell: (room) => {
        var controller = room.controller;
        var spawn = room.find(FIND_MY_SPAWNS)[0];
        var sources = room.find(FIND_SOURCES);

        _.forEach(room.findPath(controller.pos, spawn.pos, { ignoreCreeps: true, ignoreRoads: false }), (posObj) => {
            room.createConstructionSite(posObj.x, posObj.y, STRUCTURE_ROAD);
        });

        _.forEach(sources, function (source) {
            constructionManager.drawCircle(room, source.pos, 1, STRUCTURE_ROAD, { buildOnWall: false });
            constructionManager.drawCircle(room, source.pos, 2, STRUCTURE_ROAD, { buildOnWall: false });
            _.forEach(room.findPath(source.pos, spawn.pos, { ignoreCreeps: true, ignoreRoads: false }), (posObj) => {
                room.createConstructionSite(posObj.x, posObj.y, STRUCTURE_ROAD);
            });
        });

        // console.log(room)
        constructionManager.drawCircle(room, spawn.pos, 1, STRUCTURE_ROAD);
        constructionManager.drawCircle(room, spawn.pos, 2, STRUCTURE_ROAD);
        constructionManager.drawCircle(room, spawn.pos, 3, STRUCTURE_EXTENSION, { count: CONSTANTS.extenstions_per_RCL[room.controller.level] })
        // constructionManager.drawCircle(room, spawn.pos, 3, STRUCTURE_EXTENSION)
        constructionManager.drawCircle(room, spawn.pos, 4, STRUCTURE_ROAD);
    },

    drawCircle: (room, position, radius, structureType, opts) => {
        var self = constructionManager;
        var buildOnWall = (opts && opts.buildOnWall) || false;
        var enforceProximity = (opts && opts.enforceProximity) || false; //No idea how to do this yet
        var count = (opts && opts.count) ? opts.count : Number.MAX_SAFE_INTEGER;
        var ignoreStructures = (opts && opts.ignoreStructures) || false;
        var d = 3 - (2 * radius);
        var x = 0;
        var y = radius;
        do {
            Memory.pos = pos;
            var pos;
            pos = new RoomPosition(position.x + x, position.y + y, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) room.createConstructionSite(pos, structureType);
            pos = new RoomPosition(position.x + x, position.y - y, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) room.createConstructionSite(pos, structureType);
            pos = new RoomPosition(position.x - x, position.y + y, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) room.createConstructionSite(pos, structureType);
            pos = new RoomPosition(position.x - x, position.y - y, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) room.createConstructionSite(pos, structureType);

            pos = new RoomPosition(position.x + y, position.y + x, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) room.createConstructionSite(pos, structureType);
            pos = new RoomPosition(position.x + y, position.y - x, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) room.createConstructionSite(pos, structureType);
            pos = new RoomPosition(position.x - y, position.y + x, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) room.createConstructionSite(pos, structureType);
            pos = new RoomPosition(position.x - y, position.y - x, position.roomName);
            if ((buildOnWall || !self.isWall(room, pos)) && (ignoreStructures || !self.isStructure(room, pos)) && --count >= 0) room.createConstructionSite(pos, structureType);
            if (d < 0) {
                d = d + (4 * x) + 6;
            } else {
                d = d + 4 * (x - y) + 10;
                y--;
            }
            x++;
        } while (x <= y);
    },

    isWall: (room, pos) => {
        return _.find(room.lookAt(pos), { type: "terrain", terrain: "wall" });
    },

    isStructure: (room, pos) => {
        return _.find(room.lookAt(pos), { type: LOOK_CONSTRUCTION_SITES }) || _.find(room.lookAt(pos), { type: LOOK_STRUCTURES });
    }
}

module.exports = constructionManager;