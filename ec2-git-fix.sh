#!/bin/bash
# EC2 Git Fix Script - Resolve merge conflicts and pull latest changes

echo "🔧 Fixing Git merge issues on EC2..."

# Check current status
echo "📊 Current Git status:"
git status

echo ""
echo "🔍 Checking for uncommitted changes..."

# Check if there are any uncommitted changes
if git diff --quiet && git diff --staged --quiet; then
    echo "✅ No uncommitted changes found"
else
    echo "⚠️ Found uncommitted changes. Stashing them..."
    
    # Stash any uncommitted changes
    git stash push -m "Auto-stash before pulling latest changes - $(date)"
    
    echo "✅ Changes stashed successfully"
fi

# Reset any merge state
echo "🔄 Resetting any ongoing merge..."
git merge --abort 2>/dev/null || true
git rebase --abort 2>/dev/null || true

# Fetch latest changes
echo "📥 Fetching latest changes from origin..."
git fetch origin

# Reset to match remote main branch
echo "🔄 Resetting to match remote main branch..."
git reset --hard origin/main

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Check if stash exists and offer to restore
if git stash list | grep -q "Auto-stash"; then
    echo ""
    echo "📋 Found stashed changes. You can restore them later with:"
    echo "   git stash pop"
    echo ""
    echo "🔍 Stashed changes:"
    git stash list | head -5
fi

echo ""
echo "✅ Git fix completed!"
echo "📊 Current status:"
git status

echo ""
echo "🎯 Next steps:"
echo "1. Check if application needs restart: docker-compose restart"
echo "2. If you had local changes, review stash: git stash show"
echo "3. Apply stashed changes if needed: git stash pop"