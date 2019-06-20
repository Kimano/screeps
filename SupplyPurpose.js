const CONSTANTS = require('screepsConstants')

class SupplyPurpose {
    constructor(pylon) {
        this.pylon = pylon;
        this.nexus = pylon.nexus;
        this.room = this.nexus.room;
        this.maxCreeps = {
            [CONSTANTS.role.shuttle]: 1,
            [CONSTANTS.role.probe]: 2
        }
    }

    preRun() {
        // debugger;
        // this.creeps = this.room.find(FIND_MY_CREEPS, {
        //     filter: (creep) => creep.memory.owner === this.id
        // });
        // this.creepsByRole = _.groupBy(this.creeps, creep => creep.memory.role)||{};
        this.spawnCreeps(CONSTANTS.role.probe);
        this.spawnCreeps(CONSTANTS.role.shuttle);
        this.constructionSites = this.room.find(FIND_MY_CONSTRUCTION_SITES);
    }

    run() {
        // debugger;
        // var needCreeps = missingCount>0;
        // if(needCreeps) {
        //     // debugger;
        //     this.executor.requestCreeps(CONSTANTS.role.void_ray, missingCount, {
        //         owner: this.id
        //     });
        // }
    }

    spawnCreeps(role) {
        // debugger;
        var creeps = this.pylon.creepsByRole[role];
        var numRole = creeps ? creeps.length : 0;
        var toSpawn = this.maxCreeps[role] - numRole;
        if (toSpawn > 0) {
            // debugger;
            this.nexus.executor.requestCreeps(role, toSpawn, {
                owner: this.id
            });
        }
    }

    handleWorker(creep) {
        if(creep.carry.energy > 0) {
            if (this.room.controller.ticksToDowngrade <= 5000) {
				if (this.upgradeActions(worker)) return;
            }
            if (this.repairStructures.length > 0) {
				if (this.repairActions(worker)) return;
            }
            if (this.constructionSites.length > 0) {
				if (this.buildActions(worker)) return;
            }
            if (this.upgradeActions(worker)) return;
        } else {
            worker.task = this.refillActions(worker);
        }
    }

    upgradeActions(creep) {
		creep.task = TasksBase.upgrade(this.room.controller);
		return true;
    }
    
    repairActions(creep) {
		creep.task = TasksBase.repair(this.room.controller);
		return true;
    }
    
    buildActions(creep) {
		creep.task = TasksBase.build(this.room.controller);
		return true;
    }
    
    refillActions(creep) {
		creep.task = TasksBase.refill(this.room.controller);
		return true;
    }
};

module.exports = SupplyPurpose;