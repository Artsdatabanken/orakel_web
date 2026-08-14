#!/bin/sh
# Runs via nginx's /docker-entrypoint.d before serving. Injects the runtime
# API token (App Service app setting, resolved from Key Vault) into the page.
echo "window.ENV = { AI_TOKEN: \"${AI_TOKEN}\" };" > /usr/share/nginx/html/env.js
