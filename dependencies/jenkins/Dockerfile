# jenkins/jenkins:lts n'embarque pas le CLI docker : necessaire pour que le
# Jenkinsfile (docker build / docker run) fonctionne via le socket hote monte
# dans le service jenkins du docker-compose.
FROM jenkins/jenkins:lts

# Plugins requis par le Jenkinsfile : pipeline declaratif, checkout Git,
# trigger githubPush(), credential "Secret file" (withCredentials([file(...)])),
# et Configuration as Code (bootstrap de l'admin, cf. jenkins.yaml).
RUN jenkins-plugin-cli --plugins \
  "configuration-as-code git github workflow-aggregator credentials-binding"

USER root
RUN apt-get update \
  && apt-get install -y --no-install-recommends docker.io \
  && rm -rf /var/lib/apt/lists/*
USER jenkins

# Hors de /var/jenkins_home : ce chemin est recouvert par le volume
# persistant monte dessus (docker-compose), un COPY dedans ne survivrait
# pas au premier demarrage. JENKINS_ADMIN_ID/JENKINS_ADMIN_PASSWORD (.env)
# fixent le compte admin au demarrage, sans passer par l'assistant
# d'installation ni son mot de passe genere aleatoirement.
COPY jenkins.yaml /var/jenkins_config/jenkins.yaml
ENV CASC_JENKINS_CONFIG=/var/jenkins_config/jenkins.yaml
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"
