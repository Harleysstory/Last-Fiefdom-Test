# Last Fiefdom - Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18+) - https://nodejs.org/
- **npm** (v9+) - Comes with Node.js
- **PostgreSQL** (v14+) - https://www.postgresql.org/download/
- **Git** - https://git-scm.com/
- **OpenAI API Key** (or Ollama for local LLMs)

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/Harleysstory/Last-Fiefdom-Test.git
cd Last-Fiefdom-Test
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including React, Express, Prisma, Socket.io, and more.

### Step 3: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/last_fiefdom"

# OpenAI API (for AI features)
OPENAI_API_KEY="sk-your-key-here"
OPENAI_MODEL="gpt-4"

# Or use Ollama for local LLMs
OLLAMA_ENABLED=false
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="mistral"

# Server
PORT=3001
NODE_ENV="development"

# Frontend
VITE_API_URL="http://localhost:3001"
```

**Getting an OpenAI API Key**:
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Create an API key in the dashboard
4. Paste it in your `.env` file

**Alternative - Ollama (Local LLM)**:
1. Install Ollama: https://ollama.ai
2. Run: `ollama pull mistral`
3. Set `OLLAMA_ENABLED=true` in `.env`

### Step 4: Setup PostgreSQL Database

**Create the database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE last_fiefdom;

# Exit
\q
```

**Run migrations:**

```bash
npm run db:migrate
```

This creates all tables defined in `prisma/schema.prisma`.

**View the database (optional):**

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555 to view and edit data.

### Step 5: Start Development Server

```bash
npm run dev
```

This starts both the React frontend and Express backend:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **WebSocket**: ws://localhost:3001

### Step 6: Initialize Your First Game

Open http://localhost:5173 in your browser.

You should see:
1. Game initialization screen
2. Create your civilization
3. Choose civilization type
4. Start managing your kingdom!

---

## Troubleshooting

### Error: "Cannot find module"

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Error: "ECONNREFUSED localhost:5432"

PostgreSQL is not running. Start it:

**macOS:**
```bash
brew services start postgresql
```

**Windows:**
```bash
# Use Services app or:
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start
```

**Linux:**
```bash
sudo systemctl start postgresql
```

### Error: "Cannot connect to OpenAI"

1. Check your API key in `.env`
2. Verify you have API credits: https://platform.openai.com/account/billing/overview
3. Check OpenAI status: https://status.openai.com/

**Fallback to text responses:**
If LLM fails, the game uses default responses. Check browser console for errors.

### Error: "Port 3001 already in use"

Change the port in `.env`:
```env
PORT=3002
```

Then restart the server.

### Error: Database migration fails

```bash
# Reset database (WARNING: deletes all data)
npm run db:reset

# Or manually:
npm run db:migrate:reset
```

### Frontend not loading

1. Check http://localhost:5173 (not 3000)
2. Open browser DevTools (F12) and check Console for errors
3. Clear browser cache: `Ctrl+Shift+Delete`

---

## Database Setup Details

### What Migrations Do

Migrations create the database schema with these tables:

- **users** - Player accounts
- **civilizations** - Player kingdoms
- **resources** - Current resources (wood, stone, gold, food)
- **buildings** - Constructed buildings
- **troops** - Military units
- **heroes** - Recruited heroes
- **technologies** - Researched techs
- **battles** - Battle history
- **gameEvents** - Random events
- **diplomaticMessages** - Player messages
- **alliances** - Alliance data
- **notifications** - Player notifications

### Viewing Database

**Option 1: Prisma Studio**
```bash
npm run db:studio
```

**Option 2: psql (PostgreSQL CLI)**
```bash
psql -U postgres -d last_fiefdom

# View tables
\dt

# Query a table
SELECT * FROM civilizations;

# Exit
\q
```

**Option 3: Third-party GUI**
- DBeaver (free)
- pgAdmin (free web interface)
- Navicat (paid)

---

## Configuration Options

### Game Balance (src/shared/gameConfig.ts)

Adjust game difficulty:

```typescript
// Building costs (in gameConfig.ts)
buildings: {
  farm: { buildTime: 30, cost: { wood: 50, stone: 30, gold: 10 } },
  // Increase buildTime for slower progression
  // Increase cost for more challenge
}

// Troop stats
troops: {
  militia: { attack: 2, defense: 1, health: 10 },
  // Increase attack/defense for stronger units
}

// Resource production
resources: {
  // Adjust production rates
  foodPerMinute: 10,
  woodPerMinute: 8,
  stonePerMinute: 6,
}
```

### AI Behavior (src/shared/gameConfig.ts)

Customize NPC behavior:

```typescript
// NPC decision thresholds
NPC_ATTACK_THRESHOLD: 0.7,      // 70% confidence to attack
NPC_EXPAND_THRESHOLD: 0.6,       // 60% confidence to build
NPC_ALLY_THRESHOLD: 0.5,         // 50% confidence to form alliance
NPC_UPDATE_INTERVAL: 30000,      // Update every 30 seconds
```

### LLM Configuration

**Change LLM Model:**

Edit `.env`:
```env
# Use GPT-3.5 (faster, cheaper)
OPENAI_MODEL="gpt-3.5-turbo"

# Use GPT-4 (smarter, slower)
OPENAI_MODEL="gpt-4"
```

**Change Response Cache Time:**

Edit `src/server/services/LLMService.ts`:
```typescript
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
```

---

## Common Tasks

### Reset to Fresh Start

```bash
# Option 1: Keep database schema
npm run db:reset

# Option 2: Full clean slate (delete database)
npm run db:drop
npm run db:migrate
```

### Run Type Checking

```bash
npx tsc --noEmit
```

### Format Code

```bash
npm run format
```

### Check for Errors

```bash
npm run lint
```

### Run Tests (Future)

```bash
npm run test
```

---

## Project Structure Walkthrough

### Frontend Entry Point
**`src/client/main.tsx`**
- Loads React app
- Connects to WebSocket
- Initializes Zustand store

### Main Game Component
**`src/client/App.tsx`**
- Game UI with 5 tabs
- Real-time updates
- Player controls

### Backend Entry Point
**`src/server/index.ts`**
- Express app
- API endpoints
- WebSocket handlers
- Service initialization

### Shared Game Logic
**`src/shared/gameConfig.ts`**
- Game rules and balances
- AI prompts
- Building/troop definitions

**`src/shared/GameRulesEngine.ts`**
- Game mechanics
- Validation functions
- Calculations

### Database Schema
**`prisma/schema.prisma`**
- All table definitions
- Relationships
- Constraints

---

## Performance Tips

### For Development

1. Use `npm run dev` (hot reload enabled)
2. Keep DevTools open for debugging
3. Check Network tab for API calls
4. Use Redux DevTools for state inspection

### For Production

1. Build optimized bundle: `npm run build`
2. Use production API key
3. Enable response caching
4. Set `NODE_ENV=production`
5. Use CDN for static assets

---

## Getting Help

### Resources

- **Documentation**: Check `/docs` folder
- **GitHub Issues**: https://github.com/Harleysstory/Last-Fiefdom-Test/issues
- **API Reference**: `docs/API.md`
- **Game Rules**: `docs/GAME-RULES.md`
- **Architecture**: `ARCHITECTURE.md`

### Debugging Tips

1. **Check Browser Console** (F12)
   - Look for JavaScript errors
   - WebSocket connection errors
   - Network failures

2. **Check Server Logs**
   - API errors
   - Database errors
   - LLM service errors

3. **Use Prisma Studio**
   ```bash
   npm run db:studio
   ```
   View and edit database in real-time

4. **Monitor API Calls**
   - Open DevTools Network tab
   - Filter by XHR/Fetch
   - Check request/response

---

## Next Steps

1. ✅ Complete this setup
2. 📖 Read `ARCHITECTURE.md` to understand system design
3. 🎮 Play the game and test features
4. 📝 Check `ROADMAP.md` for development phases
5. 💻 Start contributing (see `ROADMAP.md` Phase 2)

---

## Quick Command Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Database
npm run db:migrate      # Run pending migrations
npm run db:push        # Push schema changes
npm run db:reset       # Reset database (deletes data)
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed with test data (future)

# Code Quality
npm run lint           # Check for lint errors
npm run format         # Format code
npm run type-check     # TypeScript check (future)
npm run test           # Run tests (future)

# Type Checking
npx tsc --noEmit       # Check TypeScript without building
```

---

**Setup Guide Version**: 1.0  
**Last Updated**: 2026-04-30  
**Recommended Node Version**: 18.x or 20.x
