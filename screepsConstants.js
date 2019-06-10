const screepsConstants = {
    debug: false,
    friendlies: [

    ],
    structures_peacetime_priority: {
        STRUCTURE_SPAWN: 1,
        STRUCTURE_EXTENSION: 2,
        STRUCTURE_LINK: 3,
        STRUCTURE_CONTAINER: 4,
        STRUCTURE_STORAGE: 5,
        STRUCTURE_EXTRACTOR: 6,
        STRUCTURE_ROAD: 7,
        STRUCTURE_CONTROLLER: 8,
        STRUCTURE_WALL: 9,
        STRUCTURE_TOWER: 10,
        STRUCTURE_LAB: 11,
        STRUCTURE_TERMINAL: 12,
        STRUCTURE_OBSERVER: 13,
        STRUCTURE_POWER_SPAWN: 14,
        STRUCTURE_NUKER: 15,
        STRUCTURE_RAMPART: 16
    },

    extensions_per_RCL: {
        1: 0,
        2: 5,
        3: 10,
        4: 20,
        5: 30,
        6: 40,
        7: 50,
        8: 60
    },

    colors: {
        building: "#00BFFF",
        moving: "#FFFFFF",
        repairing: "#FF0000",
        upgrading: "#006400",
        hauling: "#FFFF00"
    }
}

module.exports = screepsConstants