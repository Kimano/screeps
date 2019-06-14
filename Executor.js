const CONSTANTS = require('screepsConstants')
const ResourceCollectionPurpose = require('ResourceCollectionPurpose')

class Executor {
    purposes = [];
    goals = [];
    nexus = {};

    constructor(nexus) {
        this.init();
        this.nexus = nexus;
        this.purposes[0] = new ResourceCollectionPurpose();
    }

    init() {
        this.init = true;
        _.each(this.purposes, (purpose) => purpose.init());
    }
    
    preRun() {
        _.each(this.purposes, (purpose) => purpose.preRun());
        console.log("Executor preRun")
    }

    run() {
        _.each(this.purposes, (purpose) => purpose.run());
        console.log("Executor run")
    }
};

module.exports = Executor;