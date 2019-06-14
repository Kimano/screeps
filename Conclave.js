const CONSTANTS = require('screepsConstants')
const Nexus = require('Nexus')
const Executor = require('Executor')

class Conclave {
    inited = false;
    missions = {};
    nexi = {};
    executors = {};
    units = {};
    constructor() {

    }

    static init() {
        this.inited = true;
        this.nexi = {};
        this.executors = {};
        _.each(Game.rooms, (room) => {
            // console.log(this.nexi);
            // console.log(room)
            var roomName = room.name;
            var nexus = new Nexus(this.nexi.length, roomName);
            this.nexi[roomName] = nexus;
            this.executors[roomName] = nexus.Executor;
        });
    }

    static preRun() {
        // console.log("Conclave preRun");
        _.each(this.nexi, function(nexus){
            console.log("Nexus loop run")
            nexus.preRun()
        });
    }

    static run() {
        // console.log("Conclave run");
        _.each(this.nexi, (nexus) => nexus.run());
    }
};

module.exports = Conclave;