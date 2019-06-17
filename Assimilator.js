const CONSTANTS = require('screepsConstants')
const MiningPurpose = require('MiningPurpose')
const Unit = require('Unit')

class Assimilator {
    constructor(nexus, source) {
        this.nexus = nexus;
        this.executor = this.nexus.executor;
        this.room = nexus.room;

        this.source = source;
        this.id = this.source.id;
        this.pos = this.source.pos;
        this.creeps = [];
        this.maxCreeps = 1;

        this.purpose = new MiningPurpose(this);
        this.nexus.executor.registerPurpose(this.purpose);

        this.populateStructures();
    }

    populateStructures() {
        this.constructionSite = _.first(this.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2));
    }
    
    preRun() {
        // console.log("Assimilator preRun()")
        this.creeps = this.room.find(FIND_MY_CREEPS, {
            filter: (creep) => creep.memory.owner === this.id
        });
    }

    run() {
        // debugger;
        for(var creepId in this.creeps) {
            var miner = this.creeps[creepId];
            var creepUnit = new Unit(miner);
            if (this.container) {
                if (this.container.hits < this.container.hitsMax && miner.carry.energy >= Math.min(miner.carryCapacity, REPAIR_POWER * miner.getActiveBodyparts(WORK))) {
                    return creepUnit.goRepair(this.container);
                } else {
                    if (_.sum(miner.carry) < miner.carryCapacity) {
                        return creepUnit.goHarvest(this.source);
                    } else {
                        return creepUnit.goTransfer(this.container);
                    }
                }
            }
            if (this.constructionSite) {
                if (miner.carry.energy >= Math.min(miner.carryCapacity, BUILD_POWER * miner.getActiveBodyparts(WORK))) {
                    return creepUnit.goBuild(this.constructionSite);
                } else {
                    return creepUnit.goHarvest(this.source);
                }
            }
        }
    }
};

module.exports = Assimilator;