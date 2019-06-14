const CONSTANTS = require('screepsConstants')
const Nexus = require('Nexus')
const Executor = require('Executor')

class Conclave {
    init = false;
    missions = {};
    nexi = {};
    executors = {};
    units = {};
    init() {
        this.init = true;
        this.nexi = {};
        _.each(Game.rooms, (room) => {
            // console.log(this.nexi);
            var roomName = room.roomName;
            var nexus = new Nexus(this.nexi.length, roomName);
            this.nexi[roomName] = nexus;
            this.executors[roomName] = nexus.getExecutor();
        });
    }

    preRun() {
        _.each(this.nexi, (nexus) => nexus.preRun());
    }

    run() {
        _.each(this.nexi, (nexus) => nexus.run());
    }
};

module.exports = Conclave;