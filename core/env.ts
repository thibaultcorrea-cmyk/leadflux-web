import z from "zod";

const envSchema = z.object({
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
    DATABASE_URL: z.string().default("postgresql://leadflux:leadflux@localhost:5432/leadflux"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
    ADMIN_EMAIL: z.string().email().default("[EMAIL_ADDRESS]"),
    ADMIN_PASSWORD: z.string().min(1).default("passw@rd2026"),
    ADMIN_NAME: z.string().default("Admin"),
    ADMIN_IMAGE_URL: z.url().default(""),
    N8N_WEBHOOK_URL: z.url().default("http://localhost:5678"),
    SMTP_USER: z.string().default("assadi.halifa@gmail.com"),
    SMTP_PASS: z.string().default(""),
    SMTP_HOST: z.string().default("localhost"),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_FROM: z.string().default("assadi.halifa@gmail.com"),
    SMTP_FROM_ALIAS: z.string().default("LeadFlux"),

    // Boite IMAP applicative reelle, lue par features/imap pour la detection
    // de reponse. Distincte de IMAP_TEST_* : celles-ci pointent sur la boite
    // GreenMail de docker-compose (preuve de faisabilite locale), celles-ci
    // pointent sur la vraie boite en prod. Cf. CLAUDE.md §8, point 1 : le lieu
    // d'execution reel (site vs workflow n8n) n'est pas encore tranche.
    IMAP_HOST: z.string().default("localhost"),
    IMAP_PORT: z.coerce.number().default(993),
    IMAP_USER: z.string().default("assadi.halifa@gmail.com"),
    IMAP_PASS: z.string().default(""),
    // TLS implicite (port 993) par defaut, comme un vrai serveur IMAP. A
    // mettre a "false" en local pour pointer sur GreenMail (IMAP en clair,
    // port 3143) sans changer de code.
    IMAP_SECURE: z.stringbool().default(true),

    // Boite de test GreenMail (docker-compose), pour verifier en local la
    // detection de reponse par IMAP. Jamais utilise en production : la
    // detection reelle passe par le workflow n8n (CLAUDE.md §8, point 1).
    IMAP_TEST_HOST: z.string().default("localhost"),
    IMAP_TEST_PORT: z.coerce.number().default(3143),
    IMAP_TEST_USER: z.string().default("test@leadflux.local"),
    IMAP_TEST_PASS: z.string().default("test"),

    // MinIO (docker-compose) parle le protocole S3 : le SDK AWS s'y connecte
    // avec forcePathStyle + une region factice (cf. features/s3-storage).
    // Cle/secret identiques a MINIO_ROOT_USER/PASSWORD, c'est le meme MinIO.
    S3_ENDPOINT: z.string().default("http://localhost:9000"),
    S3_REGION: z.string().default("us-east-1"),
    S3_ACCESS_KEY_ID: z.string().default("leadflux"),
    S3_SECRET_ACCESS_KEY: z.string().default("leadflux"),
    S3_BUCKET: z.string().default("leadflux"),

    // Racine de stockage disque des fichiers uploades : colocalisee dans
    // features/uploads/ (chunks temporaires + fichiers finaux), jamais dans app/
    // (cf. features/uploads/storage.ts). Relatif => resolu depuis process.cwd() ;
    // absolu (ex. volume monte en prod) => utilise tel quel.
    UPLOADS_STORAGE_ROOT: z.string().default("./features/uploads/storage"),

});

export const ENV = envSchema.parse(process.env);
