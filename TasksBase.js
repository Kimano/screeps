class TasksBase {
    static build(target, options) {
        return new TaskBuild(target, options);
    }

    static harvest(target, options) {
        return new TaskHarvest(target, options);
    }

    static pickup(target, options) {
        return new TaskPickup(target, options);
    }

    static transfer(target, resourceType, amount, options) {
        return new TaskTransfer(target, resourceType, amount, options);
    }

    static upgrade(target, options) {
        return new TaskUpgrade(target, options);
    }

    static withdraw(target, resourceType, amount, options) {
        return new TaskWithdraw(target, resourceType, amount, options);
    }

    static repair(target, options) {
        return new TaskRepair(target, options);
    }
}

module.exports = TasksBase;