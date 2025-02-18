#!/bin/sh
cd ../../packages/db
npm run db:push -- --accept-data-loss
cd -
node dist/index.js
