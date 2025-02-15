#!/bin/sh

docker build -t c-runner -f ./runners/c/Dockerfile ./runners/c
docker build -t  javascript-runner -f ./runners/node/Dockerfile ./runners/node
docker build -t python-runner -f ./runners/python/Dockerfile ./runners/python
docker build -t java-runner -f ./runners/java/Dockerfile ./runners/java
