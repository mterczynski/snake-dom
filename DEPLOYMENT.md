# Deployment Setup

This repository now uses GitHub Actions for automatic deployment instead of the manual `deploy.sh` script.

## GitHub Action Workflow

The deployment workflow (`.github/workflows/deploy.yml`) automatically:

1. Triggers on pushes to `main`/`master` branches
2. Checks out both this repository and the target `mterczynski.github.io` repository
3. Copies the game files (`img/`, `index.html`, `main.js`) to the `snake/` directory in the target repository
4. Commits and pushes the changes to deploy the updated game

## Required Secrets

For the workflow to function, you need to configure the following secret in your repository settings:

- `DEPLOY_TOKEN`: A GitHub Personal Access Token with repository access to push to `mterczynski/mterczynski.github.io`

## Manual Deployment

If you need to deploy manually, you can:
1. Go to the Actions tab in GitHub
2. Select the "Deploy Snake Game" workflow
3. Click "Run workflow" to trigger a manual deployment

## Legacy Deployment

The old `deploy.sh` script is preserved for reference but is no longer needed for deployment.