const Roles = require('Roles')

class UnitSetup {

    constructor(role, capacity) {
        // this.setup = UnitSetup.getByRole(roleName);
        this.role = role.name;
        this.bodySetup = UnitSetup.buildBody(role.body, capacity);
        this.name = UnitSetup.generateName(role.name);
    }

    getRole() {
        return this.role;
    }

    static generateName(role) {
        return `${role}-${Game.time}`
    }

    static getByRole(roleName) {
        return Roles.Setups[roleName];
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
        while (totalCost + additionalBodyPartsCost < capacity) {
            body = body.concat(additionalBodyParts);
            totalCost += additionalBodyPartsCost;
        }

        return body;
    }
}

module.exports = UnitSetup;