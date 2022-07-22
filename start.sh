#!/bin/bash
DEBUG=express-http-proxy \
NODE_ENV=development \
REACT_APP_ADMIN_USER_ROLE=GASTROGRAPH_ADMIN \
REACT_APP_SUPERADMIN_USER_ROLE=GASTROGRAPH_SUPERADMIN \
GRAPHQL_ENDPOINT=https://staging.next.gastrograph.com/graphql/graphql \
IAM_ENDPOINT=https://staging.next.gastrograph.com/iam/iam \
npx concurrently "node startserver.js" "node server.src/server.js"

