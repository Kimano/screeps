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
        STRUCTURE_TOWER: 6,
        STRUCTURE_EXTRACTOR: 7,
        STRUCTURE_ROAD: 8,
        STRUCTURE_CONTROLLER: 9,
        STRUCTURE_WALL: 10,
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
        building:   "#FF00FF",
        moving:     "#FFFFFF",
        repairing:  "#FF6600",
        upgrading:  "#00FFFF",
        hauling:    "#00FF00",
        collecting: "#FFFF00"
    },
    
    role: {
        zealot:     "zealot",     // Offensive oriented Melee Unit
        dragoon:    "dragoon",    // Offensive oriented Ranged Unit
        archon:     "archon",     // Defensive oriented Melee Unit
        immortal:   "immortal",   // Defensive oriented Ranged Unit
        reaver:     "reaver",     // Dismantler
        scarab:     "scarab",     // Cannon fodder
        templar:    "templar",    // Healer
        warp_prism: "warp_prism", // Colonist/Claimer
        scout:      "scout",      // Scout
        mothership: "mothership", // Manager
        void_ray:   "void_ray",   // Harvester
        oracle:     "oracle",     // Upgrader
        probe:      "probe",      // General purpose worker
        shuttle:    "shuttle",    // hauler
    }
}

module.exports = screepsConstants