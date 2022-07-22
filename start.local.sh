#!/bin/bash
DEBUG=express-http-proxy \
NODE_ENV=development \
REACT_APP_ADMIN_USER_ROLE=GASTROGRAPH_ADMIN \
REACT_APP_SUPERADMIN_USER_ROLE=GASTROGRAPH_SUPERADMIN \
GRAPHQL_ENDPOINT=http://127.0.0.1:3001/graphql \
IAM_ENDPOINT=http://127.0.0.1:3002/ \
npx concurrently "node startserver.js" "node server.src/server.js"

