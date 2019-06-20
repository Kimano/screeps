const CONSTANTS = require('screepsConstants')

class UnitSetup {

    constructor(role, capacity, opts) {
        // debugger;
        this.opts = opts;
        this.setup = UnitSetup[role];
        this.role = role;
        this.bodySetup = UnitSetup.buildBody(this.setup.body, capacity);
        this.name = UnitSetup.generateName(this.setup.name);
        // console.log("UnitSetup constructed: " + this.setup.name +" by: "+opts.owner);
    }

    getRole() {
        return this.role;
    }

    getMemory() {
        var memory = {};
        memory.role = this.role;
        if(this.opts && this.opts.owner) {
            memory.owner = opts.owner;
        }
        return memory;
    }

    static generateName(role) {
        return `${role}-${Game.time}`
    }

    static getByRole(roleName) {
        return this.roles[roleName];
    }

    static buildBody(bodySetup, capacity) {
        let baseBodyParts = bodySetup.baseBodyParts;
        let additionalBodyParts = bodySetup.additionalBodyParts;
        let body = baseBodyParts;
        var baseBodyPartsCost = _.reduce(baseBodyParts, (result, value) => {
            return result += BODYPART_COST[value];
        }, 0);
        var additionalBodyPartsCost = _.reduce(additionalBodyParts, (result, value) => {
            return result += BODYPART_COST[value];
        }, 0);
        let totalCost = baseBodyPartsCost;
        while (totalCost + additionalBodyPartsCost < capacity && additionalBodyPartsCost > 0) {
            body = body.concat(additionalBodyParts);
            totalCost += additionalBodyPartsCost;
        }

        return body;
    }

    static [CONSTANTS.role.probe] = {
        name: "Probe",
        role: CONSTANTS.role.probe,
        body: {
            baseBodyParts: [WORK, CARRY, MOVE],
            additionalBodyParts: []
        }
    }
    static [CONSTANTS.role.void_ray] = {
        name: "Void Ray",
        role: CONSTANTS.role.void_ray,
        body: {
            baseBodyParts: [CARRY, WORK, WORK, MOVE],
            additionalBodyParts: [WORK]
        }
    }
    static [CONSTANTS.role.shuttle] = {
        name: "Shuttle",
        role: CONSTANTS.role.shuttle,
        body: {
            baseBodyParts: [CARRY, CARRY, MOVE],
            additionalBodyParts: [CARRY, CARRY, MOVE]
        }
    }
}

module.exports = UnitSetup;