#!/bin/sh
cd ../../packages/db
npm run db:push
cd -
node dist/index.js
