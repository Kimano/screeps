class TaskTransfer {
    constructor(target, opts) {
        this.range = 1;
        this.name = "TaskTransfer";
        this.target = target;
        this.resourceType = resourceType;
        this.amount = amount;
        this.opts = opts;
    }

    work() {
		return this.creep.transfer(this.target, this.resourceType, this.amount);
	}

	isValidTask() {
		const amount = this.amount || 1;
		const resources = this.creep.carry[this.resourceType] || 0;
		return resources >= amount;
	}

    isValidTarget() {
		const amount = this.amount || 1;
		const target = this.target;
		if (store in target) {
			return _.sum(target.store) <= target.storeCapacity - amount;
		} else if (energy in target && this.data.resourceType == RESOURCE_ENERGY) {
			return target.energy <= target.energyCapacity - amount;
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

module.exports = TaskTransfer;