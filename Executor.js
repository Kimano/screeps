const CONSTANTS = require('screepsConstants')
const ResourceCollectionPurpose = require('ResourceCollectionPurpose')

class Executor {

    constructor(nexus) {
        this.nexus = nexus;
        this.name = nexus.name;
        this.purposes = [];
    }
    
    preRun() {
        this.nexus.preRun();
        _.each(this.purposes, (purpose) => purpose.preRun());
    }

    run() {
        console.log("run")
        this.nexus.run();
        _.each(this.purposes, (purpose) => purpose.run());
    }
    
    registerPurpose(purpose) {
        this.purposes.push(purpose);
    }
};

module.exports = Executor;