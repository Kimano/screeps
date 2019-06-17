const CONSTANTS = require('screepsConstants')
const Gateway = require('Gateway')
const UnitSetup = require('UnitSetup')

class Executor {

    constructor(nexus) {
        this.nexus = nexus;
        this.room = nexus.room;
        this.purposes = [];
    }
    
    preRun() {
        // console.log("Executor preRun()")
        this.nexus.preRun();
        for(var purpose in this.purposes) {
            this.purposes[purpose].preRun();
        }
    }

    run() {
        // console.log("Executor run()")
        this.nexus.run();
        for(var purpose in this.purposes) {
            this.purposes[purpose].run();
        }
    }
    
    registerPurpose(purpose) {
        this.purposes.push(purpose);
    }
    
    requestCreeps(role, num, opts) {
        const capacity = this.room.energyCapacityAvailable;
        // debugger;
        while(num-->0) {
            var unitSetup = new UnitSetup(role, capacity, opts);
            console.log(opts.owner + " is requesting " + num + " " + role);
            this.nexus.gateway.queueUnitSetup(unitSetup);
        }
    }
};

module.exports = Executor;