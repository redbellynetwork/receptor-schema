#!/bin/sh

# Copy hooks to git/hooks folder
cp ./githooks/pre-commit ./.git/hooks
cp ./githooks/commit-msg ./.git/hooks

# Set executables
chmod +x ./.git/hooks/pre-commit 
chmod +x ./.git/hooks/commit-msg