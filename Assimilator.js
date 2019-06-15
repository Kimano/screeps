const CONSTANTS = require('screepsConstants')
const MiningPurpose = require('MiningPurpose')

class Assimilator {
    source = {};
    container = {};
    link = {};
    creeps = [];
    constructor(nexus, source) {
        this.source = source;
        var pos = this.source.pos;
        // this.container = pos.findClosestByLimitedRange(Game.rooms[pos.roomName].containers, 1);
        this.nexus = nexus;
        this.purpose = new MiningPurpose(this);
        this.nexus.Executor.registerPurpose(this.purpose);
    }
    
    preRun() {
        
    }

    run() {
        _.each(this.miners, (miner) => {
            this.handleMiner(miner);
        });
    }
};

module.exports = Assimilator;