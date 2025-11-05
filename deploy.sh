#!/bin/bash

# DEPRECATED: This script has been replaced by GitHub Actions workflow
# See .github/workflows/deploy.yml and DEPLOYMENT.md for the new automated deployment
# This file is kept for reference only

# Legacy deployment script - DO NOT USE
# 2. Copy build to ../mterczynski.github.io
rm -rf ../mterczynski.github.io/snake/
mkdir ../mterczynski.github.io/snake/
cp -r ./img ../mterczynski.github.io/snake/
cp ./index.html ../mterczynski.github.io/snake/
cp ./main.js ../mterczynski.github.io/snake/
cd ../mterczynski.github.io
# 3. Commit in ../mterczynski.github.io
git add .
git commit -m "Update snake build"
git status
# 4. Push in ../mterczynski.github.io
git push
