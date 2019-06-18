const CONSTANTS = require('screepsConstants')
const SupplyPurpose = require('SupplyPurpose')

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
    }

    run() {
        // console.log("Gateway run()")
    }
};

module.exports = Pylon;