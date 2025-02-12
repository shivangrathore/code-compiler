FROM python:3.9-slim-buster
WORKDIR /app

COPY run.sh .
RUN chmod +x run.sh
ENTRYPOINT ["/app/run.sh"]
