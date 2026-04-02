#!/bin/bash

LOCAL_DIR="dist"
HOST="b4ch.altervista.org"
USER="b4ch"

REMOTE_DIR="numbah"
# must match in vite.config.js
# because the final url will be:
# https://<HOST>/<REMOTE_DIR>/

lftp -e "mirror -R $LOCAL_DIR $REMOTE_DIR; bye" -u "$USER" "$HOST"
