const CONSTANTS = require('screepsConstants')

class SupplyPurpose {
    constructor(pylon) {
        this.pylon = pylon;
        this.nexus = pylon.nexus;
        this.room = this.nexus.room;
        this.maxCreeps = {
            [CONSTANTS.role.shuttle]: 3,
            [CONSTANTS.role.probe]: 4
        }
    }

    preRun() {
        // debugger;
        this.creeps = this.room.find(FIND_MY_CREEPS, {
            filter: (creep) => creep.memory.owner === this.id
        });
        this.creepsByRole = _.groupBy(this.creeps, creep => creep.memory.role)||{};
    }

    run() {

        // var needCreeps = missingCount>0;
        // if(needCreeps) {
        //     // debugger;
        //     this.executor.requestCreeps(CONSTANTS.role.void_ray, missingCount, {
        //         owner: this.id
        //     });
        // }
    }
};

module.exports = SupplyPurpose;