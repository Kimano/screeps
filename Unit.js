const CONSTANTS = require('screepsConstants')

class Unit {
    
    init() {
        this.init = true;
        
    }
    preRun() {

    }

    run() {
        if(this.task) {
            return this.task.run();
        }
        return ERR_NOT_FOUND;
    }

    get task() {
        if(!this.task) {
            this.task = this.memory.task.init();
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

    moveTo(pos) {
        if(pos) {
            return this.creep.moveTo(pos);
        } else if(this.task && this.task.pos) {
            return this.creep.moveTo(this.task.pos);
        }
        return ERR_NOT_FOUND;
    }
};

module.exports = Unit;