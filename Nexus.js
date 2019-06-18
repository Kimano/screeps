const CONSTANTS = require('screepsConstants')
const Executor = require('Executor');
const Assimilator = require('Assimilator');
const Gateway = require('Gateway');
const Pylon = require('Pylon');

class Nexus {
    constructor(id, room, outposts) {
        this.id = id;
        this.room = room;
        this.id = id;
        this.roomName = room.name;
        this.outposts = outposts;

        // debugger;
        this.executor = new Executor(this);

        this.rooms = [this.room].concat(this.outposts);
        this.creeps = _.find(FIND_MY_CREEPS);
        this.creepsByRole = _.groupBy(this.creeps, creep => creep.memory.role)||{};
        this.controller = this.room.controller;
        this.assimilators = [];
        this.createRoomObjects();
    }

    preRun() {
        // console.log("Nexus preRun()")
        this.requests = {};
        var spawns = this.room.find(FIND_MY_SPAWNS);
        for(var assimilator in this.assimilators) {
            this.assimilators[assimilator].preRun();
        }
        this.gateway.preRun();
    }

    run() {
        // console.log("Nexus run()")
        for(var assimilator in this.assimilators) {
            this.assimilators[assimilator].run();
        }
        this.gateway.run();
    }

    createRoomObjects() {
        // debugger;
        var sources = this.room.find(FIND_SOURCES);
        for(var source in sources) {
            this.handleSource(sources[source]);
        }
        this.gateway = new Gateway(this);
        this.pylon = new Pylon(this);
    }

    handleSource(source) {
        this.assimilators = this.assimilators.concat(new Assimilator(this, source));
    }

    countUnitsByRole(role) {
        var count = _.sum(Game.creeps, (creep) => creep.memory.role == role);
        return count + this.gateway.getQueuedUnitsByRole(role);
    }
};

module.exports = Nexus;