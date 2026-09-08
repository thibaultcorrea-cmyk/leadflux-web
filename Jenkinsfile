// Pipeline declenche par un push sur `main` (webhook GitHub configure sur
// le job Jenkins, cf. README > Deploiement). Build l'image Docker de l'app
// puis (re)lance le conteneur en exposant un port simple, sans reverse
// proxy pour l'instant (cf. README, cible d'hebergement pas encore actee).
pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        IMAGE_NAME     = 'leadflux-web'
        CONTAINER_NAME = "${env.CONTAINER_NAME ?: 'leadflux-web'}"
        APP_PORT       = "${env.APP_PORT ?: '3000'}"
        // Reseau docker-compose (dependencies/docker-compose.yml) ou vit le
        // service `postgres` : necessaire pour que le conteneur app (Deploy)
        // et le conteneur de migration (DB sync) puissent le joindre par son
        // nom de service plutot que `localhost`.
        DB_NETWORK     = "${env.DB_NETWORK ?: 'leadflux-web_default'}"
    }

    options {
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build image') {
            steps {
                // Les NEXT_PUBLIC_* sont lues cote client par Next.js et
                // doivent donc etre presentes des le `docker build` (cf.
                // commentaire du Dockerfile) : on les extrait du meme
                // credential que le Deploy plutot que de les dupliquer ici.
                withCredentials([file(credentialsId: 'leadflux-web-env', variable: 'ENV_FILE')]) {
                    sh """
                        set -a
                        . "\$ENV_FILE"
                        set +a
                        docker build \
                          --build-arg NEXT_PUBLIC_APP_URL="\$NEXT_PUBLIC_APP_URL" \
                          --build-arg NEXT_PUBLIC_API_URL="\$NEXT_PUBLIC_API_URL" \
                          --build-arg NEXT_PUBLIC_GRAPHQL_URL="\$NEXT_PUBLIC_GRAPHQL_URL" \
                          --target builder -t ${IMAGE_NAME}:builder .
                        docker build \
                          --build-arg NEXT_PUBLIC_APP_URL="\$NEXT_PUBLIC_APP_URL" \
                          --build-arg NEXT_PUBLIC_API_URL="\$NEXT_PUBLIC_API_URL" \
                          --build-arg NEXT_PUBLIC_GRAPHQL_URL="\$NEXT_PUBLIC_GRAPHQL_URL" \
                          -t ${IMAGE_NAME}:${GIT_COMMIT} -t ${IMAGE_NAME}:latest .
                    """
                }
            }
        }

        stage('DB sync') {
            steps {
                // Migre le schema avant de (re)deployer le conteneur app :
                // `drizzle-kit` vit dans les devDependencies, absentes de
                // l'image finale (stage `runner`, standalone Next.js) — on
                // reutilise donc l'image intermediaire `builder`, qui a
                // node_modules complet et le dossier db/. --network pour
                // joindre `postgres` par son nom de service compose plutot
                // que `localhost` (cf. DB_NETWORK ci-dessus).
                withCredentials([file(credentialsId: 'leadflux-web-env', variable: 'ENV_FILE')]) {
                    sh """
                        docker run --rm \
                          --network ${DB_NETWORK} \
                          --env-file \$ENV_FILE \
                          ${IMAGE_NAME}:builder \
                          pnpm run db:sync
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                // Credential Jenkins de type "Secret file" contenant les
                // variables de prod (DATABASE_URL, BETTER_AUTH_SECRET,
                // SMTP_*, IMAP_*...), jamais commitees dans le repo.
                withCredentials([file(credentialsId: 'leadflux-web-env', variable: 'ENV_FILE')]) {
                    sh """
                        docker rm -f ${CONTAINER_NAME} || true
                        docker run -d \
                          --name ${CONTAINER_NAME} \
                          --restart unless-stopped \
                          --network ${DB_NETWORK} \
                          --env-file \$ENV_FILE \
                          -p ${APP_PORT}:3000 \
                          ${IMAGE_NAME}:latest
                    """
                }
            }
        }
    }

    post {
        always {
            sh "docker image prune -f --filter 'until=72h' || true"
        }
    }
}
