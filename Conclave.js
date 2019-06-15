const CONSTANTS = require('screepsConstants')
const Nexus = require('Nexus')
const Executor = require('Executor')

class Conclave {
    constructor() {
        this.nexi = {};
        this.executors = {};
        _.each(Game.rooms, (room) => {
            var roomName = room.name;
            var nexus = new Nexus(this.nexi.length, roomName);
            this.nexi[roomName] = nexus;
            this.executors[roomName] = nexus.Executor;
        });
    }

    static preRun() {
        _.each(_.values(this.executors), (executor) => executor.preRun());
    }

    static run() {
        _.each(_.values(this.executors), (executor) => executor.run());
    }
};

module.exports = Conclave;