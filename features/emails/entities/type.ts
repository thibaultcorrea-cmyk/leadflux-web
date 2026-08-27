export type EmailStatus = "draft" | "sent" | "replied";

/**
 * Une génération de l'email. L'aperçu permet d'annuler / rétablir entre les
 * régénérations successives, donc chaque génération est conservée : c'est une
 * liste de versions, pas un champ écrasé à chaque fois (CLAUDE.md §3).
 */
export type EmailVersion = {
    id: string;
    subject: string;
    /** Corps de l'email, un élément par paragraphe. */
    body: string;
    /** Date de génération, ISO. */
    generatedAt: string;
    /** Version du PDF de connaissance client ayant servi à la rédaction. */
    knowledgeVersion: string;
};

/**
 * Un email suivi, rattaché à un prospect. Modèle d'écran uniquement : le schéma
 * Drizzle réel reste à concevoir (CLAUDE.md §8, point 8).
 */
export type Email = {
    id: string;
    contactName: string;
    contactRole: string;
    company: string;
    city: string;
    recipient: string;
    status: EmailStatus;
    /** Date de la dernière activité, ISO : c'est elle qui sert au tri. */
    lastActivityAt: string;
    /** Libellé affiché de cette date, ex. « Il y a 12 min ». */
    lastActivityLabel: string;
    /** De la plus ancienne à la plus récente ; la dernière est la version courante. */
    versions: EmailVersion[];
};


export type GenerateManyResult = {
    success: boolean;
    send: number;
    failed: number;
    message?: string;
    error?: any;
}

export type ManyOperationResult = {
    success: number;
    failed: number;
    message?: string;
    error?: any;

}