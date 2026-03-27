#!/bin/sh
set -eu

# Génère env.js à partir du template
envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

exec nginx -g "daemon off;"
