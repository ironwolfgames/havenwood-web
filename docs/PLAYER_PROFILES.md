# Player Profile Integration Guide

This document explains how the player profile system integrates with the existing game session architecture.

## Player Profile System Overview

The player profile system creates a seamless link between Supabase authentication and the game's player management, with automatic profile creation and comprehensive validation.

## Database Integration

The system leverages the existing database schema:

### Players Table (Already Created)
- `id` - UUID primary key
- `user_id` - Links to Supabase auth.users
- `username` - Unique display name (3-20 chars, alphanumeric + underscore)
- `created_at` / `updated_at` - Timestamps
- **RLS Policies**: Users can only access their own profile

### Session Players Table (Already Created)  
- Links `players` to `game_sessions` with chosen `factions`
- Foreign key relationships maintain data integrity

## Authentication Flow

1. **User Registration/Login** → Supabase handles authentication
2. **First Login** → System prompts for username creation
3. **Profile Creation** → Validates username uniqueness and format
4. **Session Access** → Player can now join game sessions

## Integration with Game Sessions

### Joining a Game Session
```typescript
// Example integration code for session joining
const joinGameSession = async (sessionId: string, factionId: string) => {
  if (!player) {
    throw new Error('Must have player profile to join session')
  }
  
  await sessionPlayerOperations.joinSession({
    session_id: sessionId,
    player_id: player.id,
    faction_id: factionId
  })
}
```

### Existing Database Operations
The system uses existing operations from `database-operations.ts`:
- `playerOperations.create()` - Create player profile
- `playerOperations.getByUserId()` - Load player by auth user
- `playerOperations.getByUsername()` - Check username availability
- `playerOperations.update()` - Update player profile

## Username Validation Rules

- **Length**: 3-20 characters
- **Format**: Letters, numbers, underscore only (`/^[a-zA-Z0-9_]+$/`)
- **Uniqueness**: Checked against existing players in real-time
- **Debounced**: 500ms delay to avoid excessive API calls

## Component Architecture

### Context & Hooks
- `AuthContext` - Manages authentication state and player profile
- `useAuth()` - Access authentication state
- `usePlayer()` - Access player-specific operations and validation

### UI Components
- `PlayerProfile` - Display player information
- `ProfileForm` - Create/edit player profiles with validation
- `AuthForm` - Handle login/signup
- `Navigation` - Smart navigation that adapts to auth state

## Error Handling

### Graceful Degradation
- Works without Supabase configuration (shows setup instructions)
- Handles network errors during validation
- Provides clear feedback for validation failures

### Username Conflicts
- Real-time checking prevents most conflicts
- Server-side validation as fallback
- Clear error messages for resolution

## Future Enhancements

1. **Avatar System** - Add profile pictures using Supabase Storage
2. **Player Statistics** - Track games played, wins, etc.
3. **Profile Preferences** - Game settings, notification preferences
4. **Social Features** - Friend lists, player ratings

## Testing

### Manual Testing Scenarios
1. **New User Flow**: Register → Create profile → Join session
2. **Existing User**: Login → Access profile → Update username
3. **Validation Testing**: Try duplicate usernames, invalid formats
4. **Network Errors**: Test offline scenarios, API failures

### Integration Testing
- Verify player profiles link correctly to session participation
- Test RLS policies prevent unauthorized access
- Validate database constraints (username uniqueness, etc.)

## Security Considerations

### Row Level Security (RLS)
- Players can only access their own profiles
- Username checks use safe queries
- Profile updates validated server-side

### Input Validation
- Client-side validation for UX
- Server-side validation for security
- SQL injection protection via parameterized queries

### Authentication
- Supabase handles secure authentication
- JWT tokens for session management
- Automatic session refresh