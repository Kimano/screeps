const CONSTANTS = require('screepsConstants')

class Nexus {
    id = undefined;
    creeps = {};
    creepsByRole = {};
    roomName = undefined;
    controller = undefined;
    spawns = [];
    extensions = [];
    sources = [];
    constructionSites = [];
    miningSites = {};
    executor = {};
    storage = undefined;

    constructor(id, roomName, outposts) {
        this.id = id;
        this.roomName = roomName;
        this.outposts = outposts;
        this.executor = new Executor(this);
        this.init(id, roomName, outposts);
    }

    init(id, roomName) {
        console.log("init");
        this.id = id;
        this.name = roomName;
        this.room = Game.rooms[roomName];
        this.outposts = _.compact(_.map(outposts, outpost => Game.rooms[outpost]));
        this.rooms = [this.room].concat(this.outposts);
        this.creeps = _.find(FIND_MY_CREEPS);
        this.creepsByRole = _.groupBy(this.creeps, creep => creep.memory.role);
        this.controller = this.room.controller;
        this.createRoomObjects();
    }
    preRun() {
        
    }
    run() {
        console.log("run");
    }

    createRoomObjects() {
        _.each(this.room.find(FIND_SOURCES), (source) => {
            this.handleSource(source);
        });
        var storage = this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_STORAGE
        });
        if(storage) this.storage = storage;
    }

    handleSource(source) {
        this.miningSites.push(new Assimilator(this, source));
    }
};

module.exports = Nexus;