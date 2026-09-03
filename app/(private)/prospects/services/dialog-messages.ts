
export type ActionsCount = { send: number, failed: number }

export const dialogMessages = {
    searchProspects: {
        success: {
            title: "Recherche effectuée",
            description: "La recherche a été effectuée avec succès.",
        },
        error: {
            title: "Erreur",
            description: "Une erreur est survenue lors de la recherche.",
        },
    },

    drafting: ({ send, failed }: ActionsCount) => {
        return {
            success: {
                title: "Brouillon rédigé",
                description: `${send} brouillon${send !== 1 ? "s" : ""} rédigé${send !== 1 ? "s" : ""} avec succès, ${failed} échec${failed !== 1 ? "s" : ""} d'envoi`,

            },
            error: {
                title: "Erreur",
                description: "Une erreur est survenue lors de la rédaction du brouillon.",
            },
        }
    },
    draftingMany: ({ send, failed }: ActionsCount) => {
        return {
            success: {
                title: "Brouillons rédigés",
                description: `${send} brouillon${send !== 1 ? "s" : ""} rédigé${send !== 1 ? "s" : ""} avec succès, ${failed} échec${failed !== 1 ? "s" : ""} d'envoi`,
            },
            error: {
                title: "Erreur",
                description: "Une erreur est survenue lors de la rédaction des brouillons.",
            },
        }
    },
    deletion: {
        success: {
            title: "Supprimé",
            description: "La fiche a été supprimée avec succès.",
        },
        error: {
            title: "Erreur",
            description: "Une erreur est survenue lors de la suppression de la fiche.",
        },
    },
    deletionMany: {
        success: {
            title: "Supprimé",
            description: "Les fiches ont été supprimées avec succès.",
        },
        error: {
            title: "Erreur",
            description: "Une erreur est survenue lors de la suppression des fiches.",
        },
    },
} as const