const CONSTANTS = require('screepsConstants')

class Assimilator {
    source = {};
    container = {};
    link = {};
    creep = {};
    constructor(source) {
        this.source = source;
    }
    
    init() {
        this.init = true;
        var pos = this.source.pos;
        this.container = pos.findClosestByLimitedRange(Game.rooms[pos.roomName].containers, 1);
        // this.link = pos.findClosestByLimitedRange(, 2);
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