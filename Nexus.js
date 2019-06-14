const CONSTANTS = require('screepsConstants')
const Executor = require('Executor');
const Assimilator = require('Assimilator');
const Gateway = require('Gateway');

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
    miningSites = [];
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
        // console.log("init");
        // console.log(roomName)
        this.id = id;
        this.name = roomName;
        this.room = Game.rooms[roomName];
        // this.outposts = _.compact(_.map(outposts, outpost => Game.rooms[outpost]));
        this.rooms = [this.room].concat(this.outposts);
        this.creeps = _.find(FIND_MY_CREEPS);
        this.creepsByRole = _.groupBy(this.creeps, creep => creep.memory.role);
        this.controller = this.room.controller;
        this.createRoomObjects();
    }
    preRun() {
        this.requests = {};
        var spawns = this.room.find(FIND_MY_SPAWNS);
        // console.log("Nexus preRun");

        this.executor.preRun();
    }
    run() {
        // console.log("Nexus run");

        this.executor.run();
    }

    createRoomObjects() {
        _.each(this.room.find(FIND_SOURCES), (source) => {
            this.handleSource(source);
        });
        var storage = this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_STORAGE
        });
        if(storage) this.storage = storage;
        var extensions = this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_EXTENSION
        });
        if(extensions) this.extensions = extensions;
        this.gateway = new Gateway(this);
    }

    handleSource(source) {
        this.miningSites = this.miningSites.concat(new Assimilator(this, source));
    }

    get Executor() {
        return this.executor;
    }

    get capacity() {

    }
};

module.exports = Nexus;