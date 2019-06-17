const CONSTANTS = require('screepsConstants')

class Unit {
    constructor(creep) {
        this.creep = creep;
        this.pos = creep.pos;
    }

    preRun() {

    }

    run() {
        if(this.task) {
            return this.task.run();
        }
        return ERR_NOT_FOUND;
    }

    build(target) {
		return this.creep.build(target);
    }
    
    goBuild(target) {
		if (this.pos.inRangeTo(target.pos, 3)) {
			return this.build(target);
		} else {
			return this.goTo(target);
		}
    }
    
    harvest(source) {
		return this.creep.harvest(source);
	}

	goHarvest(source) {
		if (this.pos.inRangeTo(source.pos, 1)) {
			return this.harvest(source);
		} else {
			return this.goTo(source);
		}
    }

    transfer(target, resourceType, amount) {
		return this.creep.transfer(target, resourceType, amount);
	}

	goTransfer(target, resourceType, amount) {
        // debugger;
		if (this.pos.inRangeTo(target.pos, 1)) {
			return this.transfer(target, resourceType, amount);
		} else {
			return this.goTo(target);
		}
	}
    
    upgradeController(controller) {
		return this.creep.upgradeController(controller);
	}
    
    goTo(destination) {
		return this.creep.travelTo(destination);
	}

    get task() {
        if(!this.task) {
            this.task = this.memory.task.build();
        }
        return this.task;
    }

    set task(task) {
        task.creep = this;
        this.task = task;
    }

    hasTask() {
        return this.task && this.task.isValid();
    }
};

module.exports = Unit;