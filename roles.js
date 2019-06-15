module.exports = Roles = {
    zealot:     "Zealot",
    dragoon:    "Dragoon",
    reaver:     "Reaver",
    scarab:     "Scarab",
    templar:    "Templar",
    warp_prism: "Warp_Prism",
    scout:      "Scout",
    mothership: "Mothership",
    void_ray:   "Void_Ray",
    oracle:     "Oracle",
    probe:      "Probe",
    shuttle:    "Shuttle",
    archon:     "Archon"
}

module.exports = Setups = {

    probe: {
        name: "Probe",
        role: Roles.probe,
        body: {
            baseBodyParts: [WORK, CARRY, MOVE],
            additionalBodyParts: []
        }
    },
    void_ray: {
        name: "Void_Ray",
        role: Roles.void_ray,
        body: {
            baseBodyParts: [CARRY, WORK, WORK, MOVE],
            additionalBodyParts: [WORK]
        }
    },
    shuttle: {
        name: "Shuttle",
        role: Roles.shuttle,
        body: {
            baseBodyParts: [CARRY, CARRY, MOVE],
            additionalBodyParts: [CARRY,CARRY,MOVE]
        }
    },
    zealot: {
        name: "Zealot"
    },
    archon: {
        name: "Archon"
    },
    dragoon: {
        name: "Dragoon"
    }

}