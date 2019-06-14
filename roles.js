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
    miners: {
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
        }
    },
    logistics: {
        shuttle: {
            name: "Shuttle",
            role: Roles.shuttle,
            body: {
                baseBodyParts: [CARRY, CARRY, MOVE],
                additionalBodyParts: [CARRY,CARRY,MOVE]
            }
        }
    },
    melee: {
        zealot: {
            name: "Zealot"
        },
        archon: {
            name: "Archon"
        }
    },
    ranged: {
        dragoon: {
            name: "Dragoon"
        }
    }
}