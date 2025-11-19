#!/bin/bash
set -e

# ============================================
# Next.js Landing Deployment Script
# Pulls, builds, and restarts Next.js website
# ============================================

echo "=================================================="
echo "Next.js Landing Deployment - $(date)"
echo "=================================================="

LANDING_PATH="/home/sentra/Sentra/sentra-landing"
LOG_FILE="/home/sentra/Sentra/logs/deploy-landing.log"

# Create log directory
mkdir -p "$(dirname "$LOG_FILE")"

# Log output
exec > >(tee -a "$LOG_FILE") 2>&1

cd "$LANDING_PATH"

echo ""
echo "[1/5] Pulling latest code..."
sudo -u sentra git pull || {
    echo "ERROR: Failed to pull latest code"
    exit 1
}

echo ""
echo "[2/5] Checking for dependency updates..."
if git diff HEAD@{1} --name-only 2>/dev/null | grep -q "package.json\|package-lock.json"; then
    echo "Dependencies changed - installing..."
    sudo -u sentra npm install
else
    echo "No dependency changes detected - skipping npm install"
fi

echo ""
echo "[3/5] Building production Next.js app..."
sudo -u sentra npm run build || {
    echo "ERROR: Next.js build failed"
    exit 1
}

echo ""
echo "[4/5] Restarting PM2 process..."
sudo -u sentra pm2 restart senaerp-frontend || {
    echo "ERROR: Failed to restart PM2 process"
    exit 1
}

echo ""
echo "[5/5] Verifying deployment..."
sleep 2
if sudo -u sentra pm2 info senaerp-frontend | grep -q "online"; then
    echo "✓ PM2 process is online"
else
    echo "WARNING: PM2 process may not be running correctly"
    sudo -u sentra pm2 status
fi

echo ""
echo "=================================================="
echo "Deployment Complete! ✓"
echo "=================================================="
cd "$LANDING_PATH" && echo "Landing version: $(git log --oneline -1)"
echo "Site: https://senaerp.com (port 3000)"
echo "Log: $LOG_FILE"
echo ""
