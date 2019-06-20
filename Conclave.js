const CONSTANTS = require('screepsConstants')
const Nexus = require('Nexus')
const Executor = require('Executor')

class Conclave {
    constructor() {
        this.nexi = {};
        this.executors = {};
        if(Game.rooms) {
            for (var roomName in Game.rooms) {
                let room = Game.rooms[roomName];
                let nexus = new Nexus(this.nexi.length, room);
                this.nexi[roomName] = nexus;
                this.executors[roomName] = nexus.executor;
            }
        }
    }

    preRun() {
        for(var i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
        // console.log("Conclave preRun()")
        // debugger;
        for(var executor in this.executors) {
            this.executors[executor].preRun();
        }
    }

    run() {
        // console.log("Conclave run()")
        for(var executor in this.executors) {
            this.executors[executor].run();
        }
    }
};

module.exports = Conclave;