FROM node:20.18.3-alpine3.21
WORKDIR /app

COPY run.sh .
RUN chmod +x run.sh
ENTRYPOINT ["/app/run.sh"]
