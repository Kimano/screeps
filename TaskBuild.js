class TaskBuild {
    constructor(target, opts) {
        this.range = 3;
        this.name = "TaskBuild";
        this.target = target;
        this.opts = opts;
    }

    work() {
		return this.creep.build(this.target);
	}

    isValidTask() {
        return this.creep.carry.energy > 0;
    }

    isValidTarget() {
        return this.target && this.target.my && this.target.progress < this.target.progressTotal;
    }

    get creep() {
        return this.creep;
    }

    set creep(creep) {
        this.creep = creep;
    }
}

module.exports = TaskBuild;