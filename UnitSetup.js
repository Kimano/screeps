const roles = require('roles')

class UnitSetup {

    constructor(roleName, capacity) {
        var setup = getByRole(roleName);
        var bodySetup = buildBody(setup.body, capacity);
        var name = generateName(setup.name);
    }

    static generateName(role) {
        return `${role}-${Game.time}`
    }

    static getByRole(roleName) {
        return _.flatMapDepth(roles.Setups, (setup) => { return setup.values(); })[roleName];
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