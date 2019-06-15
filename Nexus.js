const CONSTANTS = require('screepsConstants')
const Roles = require('Roles')
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
        this.id = id;
        this.name = roomName;
        this.room = Game.rooms[roomName];
        this.rooms = [this.room].concat(this.outposts);
        this.creeps = _.find(FIND_MY_CREEPS);
        this.creepsByRole = _.groupBy(this.creeps, creep => creep.memory.role)||{};
        this.controller = this.room.controller;
        this.createRoomObjects();
    }

    preRun() {
        this.requests = {};
        var spawns = this.room.find(FIND_MY_SPAWNS);
        this.handleBootStrap();

        this.executor.preRun();
    }

    run() {

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

    handleBootStrap() {
        if(this.countUnitsByRole(Roles.probe) < 4) {
            this.gateway.queueUnit(Roles.probe);
        }
    }

    countUnitsByRole(role) {
        return this.gateway.getQueuedUnitsByRole(role);
    }

    get Executor() {
        return this.executor;
    }

    get capacity() {

    }
};

module.exports = Nexus;