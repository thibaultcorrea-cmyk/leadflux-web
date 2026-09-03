
export type ActionsManyCount = { success: number, failed: number }

export const dialogMessages = {
    send: {
        success: (result: unknown) => {
            console.log(result);
            const { success, failed } = result as ActionsManyCount;
            return {
                title: "Email envoyé",
                description: `${success} email${success !== 1 ? "s" : ""} envoyé${success !== 1 ? "s" : ""} avec succès, ${failed} échec${failed !== 1 ? "s" : ""} d'envoi`,
            };
        },
        error: {
            title: "Erreur",
            description: "Une erreur est survenue lors de l'envoie d'email.",
        },
    },

    sendMany: {
        success: (result: unknown) => {
            const { success, failed } = result as ActionsManyCount;
            return {
                title: "Envoi d'emails",
                description: `${success} email${success !== 1 ? "s" : ""} envoyé${success !== 1 ? "s" : ""} avec succès, ${failed} échec${failed !== 1 ? "s" : ""} d'envoi`,
            };
        },
        error: {
            title: "Erreur",
            description: "Une erreur est survenue lors de l'envoie d'emails.",
        },
    },
    reGenerate: {
        success: (result: unknown) => {
            const { success, failed } = result as ActionsManyCount;
            return {
                title: "Régénération d'email",
                description: `${success} email${success !== 1 ? "s" : ""} régénéré${success !== 1 ? "s" : ""} avec succès, ${failed} échec${failed !== 1 ? "s" : ""} de régénération`,
            };
        },
        error: {
            title: "Erreur",
            description: "Une erreur est survenue lors de la régénération d'email.",
        },
    },
    reGenerateMany: {
        success: (result: unknown) => {
            const { success, failed } = result as ActionsManyCount;
            return {
                title: "Régénération d'email",
                description: `${success} email${success !== 1 ? "s" : ""} régénéré${success !== 1 ? "s" : ""} avec succès, ${failed} échec${failed !== 1 ? "s" : ""} de régénération`,
            };
        },
        error: {
            title: "Erreur",
            description: "Une erreur est survenue lors de la suppression de la fiche.",
        },
    },

    update: {
        success: {
            title: "Email mis à jour",
            description: "Le contenu de l'email a été mis à jour avec succès.",
        },
        error: {
            title: "Erreur",
            description: "Une erreur est survenue lors de la mise à jour du contenu de l'email.",
        },
    },
    updateMany: {
        success: (result: unknown) => {
            const { success, failed } = result as ActionsManyCount;
            return {
                title: "Mise à jour d'email",
                description: `${success} email${success !== 1 ? "s" : ""} mis à jour${success !== 1 ? "s" : ""} avec succès, ${failed} échec${failed !== 1 ? "s" : ""} de mise à jour`,
            };
        },
        error: {
            title: "Erreur",
            description: "Une erreur est survenue lors de la mise à jour d'email.",
        },
    },


    delete: {
        success: {
            title: "Suppression",
            description: "Email supprimé avec succès",
        },
        error: {
            title: "Erreur",
            description: "Erreur lors de la suppression",
        },


    },

    deleteMany: {
        success: {
            title: "Suppression",
            description: "Emails supprimés avec succès",
        },
        error: {
            title: "Erreur",
            description: "Erreur lors de la suppression",
        },
    },

    truncate: {
        success: {
            title: "Emails vidés",
            description: "Tous les emails ont été supprimés avec succès",
        },
        error: {
            title: "Erreur",
            description: "Erreur lors du vidage des emails",
        },
    }
} as const