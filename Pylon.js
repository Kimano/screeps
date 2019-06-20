const CONSTANTS = require('screepsConstants')
const SupplyPurpose = require('SupplyPurpose')
const Unit = require('Unit')

class Pylon {
    constructor(nexus) {
        this.nexus = nexus;
        this.room = nexus.room;
        var storage = this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_STORAGE
        });
        if(storage.length>0) this.storage = storage[0];
        var extensions = this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_EXTENSION
        });
        if(extensions) this.extensions = extensions;

        this.purpose = new SupplyPurpose(this);
        this.nexus.executor.registerPurpose(this.purpose);
    }

    preRun() {
        this.constructionSites = this.room.find(FIND_MY_CONSTRUCTION_SITES);
        this.creeps = this.room.find(FIND_MY_CREEPS, {
            filter: (creep) => creep.memory.owner === this.id
        });
        this.creepsByRole = _.groupBy(this.creeps, creep => creep.memory.role)||{};
    }

    run() {
        for(var creepId in this.creeps) {
            // debugger;
            var unit = this.creeps[creepId];
            var creepUnit = new Unit(unit);
            if(creepUnit) {
                
            }
            if (this.container) {
                // if (this.container.hits < this.container.hitsMax && miner.carry.energy >= Math.min(miner.carryCapacity, REPAIR_POWER * miner.getActiveBodyparts(WORK))) {
                //     return creepUnit.goRepair(this.container);
                // } else {
                    // if (_.sum(miner.carry) < miner.carryCapacity) {
                    //     return creepUnit.goHarvest(this.source);
                    // } else {
                    //     return creepUnit.goTransfer(this.container, RESOURCE_ENERGY, _.sum(miner.carry));
                    // }
                // }
            }
            if (this.constructionSite) {
                // if (miner.carry.energy >= Math.min(miner.carryCapacity, BUILD_POWER * miner.getActiveBodyparts(WORK))) {
                //     return creepUnit.goBuild(this.constructionSite);
                // } else {
                //     return creepUnit.goHarvest(this.source);
                // }
            }
        }
    }
};

module.exports = Pylon;