const gatherManager = {

    checkTombstones: (room) => {
        if (!Memory.tombstones) Memory.tombstones = {};
        if (room.find(FIND_TOMBSTONES).length == 0) Memory.tombstones = {};
        const tombstones = room.find(FIND_TOMBSTONES, {
            filter: (tomb) => { tomb[RESOURCE_ENERGY] > 25 && !Memory.tombstones[tomb.id] }
        })
        return tombstones;
    },

    getTombstoneToHarvest: (creep) => {
        var tombstones = gatherManager.checkTombstones(creep.room);
        if (tombstones.length > 0) {
            var tomb = tombstones[0];
            Memory.tombstones[tomb.id];
            return tomb;
        }
        return;
    }
}

module.exports = gatherManager;