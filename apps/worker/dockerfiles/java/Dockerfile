FROM openjdk:25-slim-bullseye

WORKDIR /app

COPY run.sh .
RUN chmod +x run.sh
ENTRYPOINT ["/app/run.sh"]
