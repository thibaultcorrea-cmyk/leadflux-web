# jenkins/jenkins:lts n'embarque pas le CLI docker : necessaire pour que le
# Jenkinsfile (docker build / docker run) fonctionne via le socket hote monte
# dans le service jenkins du docker-compose.
FROM jenkins/jenkins:lts

# Plugins requis par le Jenkinsfile : pipeline declaratif, checkout Git,
# trigger githubPush(), credential "Secret file" (withCredentials([file(...)])),
# Configuration as Code (bootstrap de l'admin, cf. jenkins.yaml) et job-dsl
# (creation automatique du job Pipeline, cf. jenkins.yaml > jobs:).
RUN jenkins-plugin-cli --plugins \
  "configuration-as-code git github workflow-aggregator credentials-binding job-dsl"

# CLI docker en binaire statique (download.docker.com), pas le paquet apt
# docker.io de l'image de base : sur cette version de Debian, ce paquet
# n'embarque que dockerd/docker-proxy, pas le binaire client `docker` lui
# meme, ce qui laisse `docker build`/`docker run` du Jenkinsfile echouer
# avec "docker: not found".
USER root
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates \
  && ARCH="$(dpkg --print-architecture)" \
  && case "$ARCH" in \
       amd64) DOCKER_ARCH=x86_64 ;; \
       arm64) DOCKER_ARCH=aarch64 ;; \
       *) echo "Architecture non supportee: $ARCH" >&2 && exit 1 ;; \
     esac \
  && DOCKER_TGZ="$(curl -fsSL "https://download.docker.com/linux/static/stable/${DOCKER_ARCH}/" \
       | grep -oE "docker-[0-9]+\.[0-9]+\.[0-9]+\.tgz" | sort -V | tail -1)" \
  && curl -fsSL "https://download.docker.com/linux/static/stable/${DOCKER_ARCH}/${DOCKER_TGZ}" -o /tmp/docker.tgz \
  && tar -xzf /tmp/docker.tgz -C /tmp docker/docker \
  && mv /tmp/docker/docker /usr/local/bin/docker \
  && chmod +x /usr/local/bin/docker \
  && rm -rf /tmp/docker /tmp/docker.tgz \
  && apt-get purge -y curl \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*
# /var/run/docker.sock (monte depuis l'hote) appartient au groupe root
# (GID 0) sur ce setup Docker Desktop : sans ca, `docker` renvoie
# "permission denied" pour l'utilisateur jenkins (uid 1000, pas dans ce
# groupe). Sur un futur hote de prod avec un vrai groupe `docker` (GID
# different), ajuster en consequence.
RUN usermod -aG root jenkins
USER jenkins

# Hors de /var/jenkins_home : ce chemin est recouvert par le volume
# persistant monte dessus (docker-compose), un COPY dedans ne survivrait
# pas au premier demarrage. JENKINS_ADMIN_ID/JENKINS_ADMIN_PASSWORD (.env)
# fixent le compte admin au demarrage, sans passer par l'assistant
# d'installation ni son mot de passe genere aleatoirement.
COPY jenkins.yaml /var/jenkins_config/jenkins.yaml
ENV CASC_JENKINS_CONFIG=/var/jenkins_config/jenkins.yaml
# ALLOW_LOCAL_CHECKOUT : le plugin Git bloque par defaut un remote file://
# (protection contre un checkout local arbitraire), or le job Pipeline
# clone justement depuis /repo-source (cf. jenkins.yaml > jobs:), un chemin
# monte volontairement par ce docker-compose, pas une entree utilisateur.
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false -Dhudson.plugins.git.GitSCM.ALLOW_LOCAL_CHECKOUT=true"
