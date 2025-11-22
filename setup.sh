#!/bin/bash

# Setup script for local development environment

echo "🚀 Setting up AI Productivity Benchmark for local development..."

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# Database - Local PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_productivity"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-change-in-production"

# AI - Add your Gemini API key here
GEMINI_API_KEY=""

# Environment
NODE_ENV="development"

# OAuth (Optional - can be added later)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# GITHUB_CLIENT_ID=""
# GITHUB_CLIENT_SECRET=""
# APPLE_CLIENT_ID=""
# APPLE_CLIENT_SECRET=""
# MICROSOFT_CLIENT_ID=""
# MICROSOFT_CLIENT_SECRET=""
EOF
    echo "✅ Created .env.local"
else
    echo "⚠️  .env.local already exists, skipping..."
fi

# Check if PostgreSQL is running
echo ""
echo "🔍 Checking PostgreSQL connection..."
if command -v psql &> /dev/null; then
    if psql -U postgres -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw ai_productivity; then
        echo "✅ Database 'ai_productivity' already exists"
    else
        echo "📦 Creating database 'ai_productivity'..."
        createdb -U postgres ai_productivity 2>/dev/null || echo "⚠️  Could not create database. You may need to create it manually."
    fi
else
    echo "⚠️  PostgreSQL CLI tools not found. Please ensure PostgreSQL is installed and running."
    echo "   You can install it with: brew install postgresql@15"
    echo "   Or use Docker: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres --name postgres postgres:15"
fi

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push schema to database
echo ""
echo "📊 Pushing database schema..."
npm run db:push

echo ""
echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Add your GEMINI_API_KEY to .env.local"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Visit http://localhost:3000"
