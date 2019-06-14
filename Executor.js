const CONSTANTS = require('screepsConstants')

class Executor {
    purposes = [];
    goals = [];
    nexus = {};

    constructor(nexus) {
        this.init();
        this.nexus = nexus;
    }

    init() {
        this.init = true;
        _.each(purposes, (purpose) => purpose.init());
    }
    
    preRun() {
        _.each(purposes, (purpose) => purpose.preRun());
    }

    run() {
        _.each(purposes, (purpose) => purpose.run());
    }
};

module.exports = Executor;