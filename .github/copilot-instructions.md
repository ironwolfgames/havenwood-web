# Havenwood Kingdoms - GitHub Copilot Instructions

**Always follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

Havenwood Kingdoms is an asymmetric co-op turn-based web game built with Next.js 15.5.0, TypeScript, and Supabase. The application uses the App Router architecture and is designed for real-time multiplayer gameplay with four distinct factions.

## Working Effectively

### Bootstrap and Setup
- Install dependencies: `npm install` - takes ~16 seconds. NEVER CANCEL.
- Copy environment template: `cp .env.example .env.local`
- Configure Supabase credentials in `.env.local` (see docs/SUPABASE_SETUP.md)
- Start development server: `npm run dev` - takes ~1.5 seconds startup
- Access application at: http://localhost:3000

### Build and Test Commands
- **Build production**: `npm run build` - takes ~6 seconds. NEVER CANCEL. Set timeout to 60+ minutes for safety.
- **Lint code**: `npm run lint` - takes ~5 seconds. NEVER CANCEL. Set timeout to 30+ minutes.
  - **NOTE**: Shows deprecation warning about `next lint` - this is expected and normal.
- **Start production**: `npm run start` - requires `npm run build` first
- **No test framework** is currently configured - do not attempt to run tests until implemented.

### Development Workflow
- **Always build and lint** before committing changes: `npm run build && npm run lint`
- **Always test locally** with `npm run dev` after making changes
- **Application works without Supabase** configuration - shows setup instructions gracefully
- **Test Supabase connectivity** at http://localhost:3000/test-supabase

## Validation Scenarios

### CRITICAL: Manual Testing Requirements
After making any changes, ALWAYS validate by running these complete scenarios:

1. **Basic Application Flow**:
   - Start dev server: `npm run dev`
   - Visit http://localhost:3000 - verify home page loads
   - Click "Test Supabase Connection" - verify test page loads
   - Take screenshot to document working state

2. **Supabase Integration Flow** (if configured):
   - Visit http://localhost:3000/test-supabase
   - Click each "Test" button (Client-side, Server-side, Authentication)
   - Verify connection status indicators
   - Check API endpoint: http://localhost:3000/api/test-supabase

3. **Build Validation**:
   - Run full build: `npm run build` - NEVER CANCEL, wait for completion
   - Start production server: `npm run start`
   - Verify production build works correctly

## Codebase Navigation

### Key Directories and Files
- `src/app/` - Next.js App Router pages and components
  - `src/app/page.tsx` - Home page with project status
  - `src/app/test-supabase/` - Supabase connection testing page
  - `src/app/api/test-supabase/` - API route for server-side Supabase testing
- `src/lib/supabase.ts` - Supabase client configuration (client-side and admin)
- `docs/SUPABASE_SETUP.md` - Complete Supabase setup guide
- `reference/Implementation_Plan.md` - Detailed project roadmap and tasks
- `.env.example` - Environment variables template
- `package.json` - Dependencies and scripts

### Important Code Patterns
- **Supabase Client Usage**: Import from `@/lib/supabase`
  - Client-side: `import { supabase } from '@/lib/supabase'`
  - Server-side: `import { supabaseAdmin } from '@/lib/supabase'`
- **Environment Variables**: 
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (client & server)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous key (client & server) 
  - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-only)

### Game Architecture Overview
- **Turn-based multiplayer** with simultaneous action submission
- **Four asymmetric factions**: Meadow Moles, Oakshield Badgers, Starling Scholars, River Otters
- **Shared project system** for cooperative victory conditions
- **Real-time state synchronization** via Supabase subscriptions
- **Resource management** with faction-specific mechanics

## Build Timing and Timeouts

### CRITICAL Timeout Settings
- `npm install`: Set timeout to 180+ seconds (currently ~16s)
- `npm run build`: Set timeout to 60+ minutes (currently ~6s) 
- `npm run lint`: Set timeout to 30+ minutes (currently ~5s)
- `npm run dev`: Set timeout to 30+ seconds (currently ~1.5s)

### NEVER CANCEL Commands
- **NEVER CANCEL** any build command - builds may vary in time based on system load
- **NEVER CANCEL** lint operations - wait for completion
- **NEVER CANCEL** npm install - dependency resolution can be slow

## Environment Configuration

### Supabase Setup (Optional for Development)
The application works without Supabase configuration but shows setup instructions. To configure:

1. Create Supabase project at https://supabase.com
2. Copy Project URL and anon key from project settings
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Restart dev server: `npm run dev`

### Environment Variable Validation
- Check environment status at http://localhost:3000/test-supabase
- Green checkmarks indicate properly configured variables
- Red X marks indicate missing or invalid configuration

## Development Guidelines

### Code Style and Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Uses Next.js core web vitals configuration
- **File Organization**: App Router structure in `src/app/`
- **Import Aliases**: Use `@/` for imports from `src/`

### Common Development Tasks
1. **Adding new pages**: Create in `src/app/[route]/page.tsx`
2. **Adding API routes**: Create in `src/app/api/[route]/route.ts`  
3. **Database operations**: Use Supabase client from `src/lib/supabase.ts`
4. **Styling**: TailwindCSS classes (configured in project)

### Error Handling Patterns
- Supabase client includes built-in error handling
- API routes return consistent JSON response format
- Client-side error boundaries for graceful degradation
- Environment variable validation with helpful error messages

## Troubleshooting

### Common Issues
- **"Missing env" errors**: Check `.env.local` file exists and has correct variables
- **Build failures**: Ensure all dependencies installed with `npm install`
- **Supabase connection issues**: Verify project is active and not paused
- **Lint deprecation warnings**: Expected behavior, does not affect functionality

### Debugging Steps
1. Check console for detailed error messages
2. Verify environment variables at test page
3. Test API endpoints directly in browser
4. Review Supabase dashboard for connection status

## Project Status and Roadmap

### Currently Implemented
- ✅ Next.js project with TypeScript
- ✅ Supabase client library integration
- ✅ Environment configuration system
- ✅ Connection testing utilities
- ✅ Basic UI structure and navigation

### In Progress (refer to reference/Implementation_Plan.md)
- Database schema design
- Authentication system
- Game state management
- Turn resolution engine
- Real-time subscriptions
- Faction-specific mechanics

### Key Implementation Areas
- **Core gameplay systems** - resource management, faction mechanics
- **Multiplayer infrastructure** - turn submission, resolution, synchronization  
- **Database design** - tables for games, players, actions, resources
- **Real-time features** - Supabase subscriptions for live updates
- **UI/UX implementation** - game boards, action selection, status displays

Always reference this instructions file first for common tasks and workflows. For detailed implementation guidance, consult reference/Implementation_Plan.md and docs/SUPABASE_SETUP.md.