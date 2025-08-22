# Supabase Setup Guide

This document provides instructions for setting up and configuring Supabase with the Havenwood Kingdoms project.

## Prerequisites

- A Supabase account (create one at [supabase.com](https://supabase.com))
- Node.js and npm installed
- This Next.js project cloned and dependencies installed

## Quick Setup

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Create a new project

2. **Get your project credentials**
   - Go to Settings > API
   - Copy the Project URL
   - Copy the `anon` `public` key
   - Copy the `service_role` `secret` key (for server-side operations)

3. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Test the connection**
   - Start the development server: `npm run dev`
   - Visit `http://localhost:3000/test-supabase`
   - Run the connection tests

## Environment Variables

| Variable | Description | Required | Usage |
|----------|-------------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes | Client & Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anonymous/public key | Yes | Client & Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Optional | Server only |

## Supabase Client Usage

The project includes a configured Supabase client with both browser and server-side support:

### Client-side usage:
```typescript
import { supabase } from '@/lib/supabase'

// Example: Authentication
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Example: Database query
const { data, error } = await supabase
  .from('your_table')
  .select('*')
```

### Server-side usage (API routes):
```typescript
import { supabaseAdmin } from '@/lib/supabase'

// Example: Server-side query with elevated permissions
const adminClient = supabaseAdmin()
const { data, error } = await adminClient
  .from('your_table')
  .select('*')
```

## Testing

The project includes comprehensive testing endpoints:

- **Home page**: `http://localhost:3000` - Shows setup status
- **Test page**: `http://localhost:3000/test-supabase` - Interactive connection tests
- **API endpoint**: `http://localhost:3000/api/test-supabase` - Server-side test API

## Error Handling

The Supabase client includes built-in error handling:

- Custom `SupabaseError` class for consistent error reporting
- `handleSupabaseResponse` helper for response processing
- Comprehensive logging for debugging

## TypeScript Support

The configuration includes:

- Full TypeScript definitions
- Database type safety (extend the `Database` interface as you add tables)
- Proper error types
- IntelliSense support

## Security Notes

- The `service_role` key has elevated permissions - only use it on the server side
- Never expose the service role key to the client
- Use Row Level Security (RLS) for database access control
- The anonymous key is safe for client-side use

## Next Steps

After setting up the basic connection:

1. Design your database schema in Supabase
2. Set up authentication (email/password, OAuth, etc.)
3. Configure Row Level Security policies
4. Implement real-time subscriptions for game state
5. Add database migrations and type generation

## Troubleshooting

### Connection Issues
- Check that environment variables are correctly set in `.env.local`
- Ensure your Supabase project is active and not paused
- Verify the API keys are copied correctly (no extra spaces)

### Build Issues
- Environment variables starting with `NEXT_PUBLIC_` are available at build time
- Server-only variables (like service role key) should not start with `NEXT_PUBLIC_`

### Development vs Production
- Use different Supabase projects for development and production
- Set up environment-specific configuration in your deployment platform (Vercel, etc.)

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)