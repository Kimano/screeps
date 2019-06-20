class TaskUpgrade {
    constructor(target, opts) {
        this.range = 3;
        this.name = "TaskUpgrade";
        this.target = target;
        this.opts = opts;
    }

	work() {
		return this.creep.upgradeController(this.target);
	}

	isValidTask() {
		return (this.creep.carry.energy > 0);
	}

	isValidTarget() {
		return this.target && this.target.my;
	}

    get creep() {
        return this.creep;
    }

    set creep(creep) {
        this.creep = creep;
    }
}

module.exports = TaskUpgrade;