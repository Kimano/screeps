const roleTower = {
    run: (tower) => {
        const hostileCreeps = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (c) => !(c.owner.username in Memory.friendlies)
        })
        if (hostileCreeps) {
            for (creep in hostileCreeps) {
                console.log(tower.name, 'attacking', creep.name);
                tower.attack(creep);
            }
        } else {
            const structure = tower.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hitsMax > s.hits
            })
            if (structure) {
                if(tower.hasProperty(repair)) {
                    tower.repair(structure);
                }
            }
        }
    }
}

module.exports = roleTower