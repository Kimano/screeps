const CONSTANTS = require('screepsConstants')

class MiningPurpose {
    constructor(assimilator) {
        // super(assimilator);
        this.assimilator = assimilator;
        // debugger;
        this.executor = assimilator.executor;
        this.id = assimilator.id;
        this.maxCreeps = 1;
    }
    
    preRun() {

    }

    run() {
        // console.log("MiningPurpose run()")
        var missingCount = this.maxCreeps - this.assimilator.creeps.length;
        var needCreeps = missingCount>0;
        if(needCreeps) {
            // debugger;
            this.executor.requestCreeps(CONSTANTS.role.void_ray, missingCount, {
                owner: this.id
            });
        }

        for(var creep in this.assimilator.creeps) {
            // debugger;
            if(this.assimilator.creeps[creep].run) this.assimilator.creeps[creep].run();
        }
    }
};

module.exports = MiningPurpose;