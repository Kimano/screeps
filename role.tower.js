const roleTower = {
  run: (tower) => {
    const hostileCreeps = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
      filter: (c) => !(c.owner.username in Memory.friendlies)
    })
    if (hostileCreeps !== null) {
      for (creep in hostileCreeps) {
        console.log(tower.name, 'attacking', creep.name)
        tower.attack(creep)
      }
    } else {
      const structure = tower.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax / 3
      })
      if (structure !== null) {
        tower.repair(structure)
      }
    }
  }
}

module.exports = roleTower