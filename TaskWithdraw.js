class TaskWithdraw {
    constructor(target, resourceType, amount, opts) {
        this.range = 1;
        this.name = "TaskWithdraw";
        this.target = target;
        this.resourceType = resourceType;
        this.amount = amount;
        this.opts = opts;
    }

	work() {
		return this.creep.withdraw(this.target, this.resourceType, this.amount);
	}

	isValidTask() {
		const amount = this.amount || 1;
		return (_.sum(this.creep.carry) <= this.creep.carryCapacity - amount);
	}

	isValidTarget() {
		const amount = this.amount || 1;
		const target = this.target;
		if (target instanceof Tombstone || store in target) {
			return (target.store[this.resourceType] || 0) >= amount;
		} else if (energy in target && this.resourceType == RESOURCE_ENERGY) {
			return target.energy >= amount;
		}
		return false;
	}

    get creep() {
        return this.creep;
    }

    set creep(creep) {
        this.creep = creep;
    }
}

module.exports = TaskWithdraw;