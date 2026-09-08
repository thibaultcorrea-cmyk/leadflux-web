# jenkins/jenkins:lts n'embarque pas le CLI docker : necessaire pour que le
# Jenkinsfile (docker build / docker run) fonctionne via le socket hote monte
# dans le service jenkins du docker-compose.
FROM jenkins/jenkins:lts

USER root
RUN apt-get update \
  && apt-get install -y --no-install-recommends docker.io \
  && rm -rf /var/lib/apt/lists/*
USER jenkins
