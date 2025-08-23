# Game Session Management Test Scenarios

This document outlines test scenarios for the comprehensive lobby system implementation.

## Test Scenario 1: Complete Session Lifecycle

### 1. Session Creation
**URL:** `http://localhost:3000/lobby`
**Steps:**
1. Fill session name: "Test Game Session"
2. Add description: "Testing the new lobby system features"
3. Set max players: 3
4. Select turn timer: 5 minutes
5. Choose difficulty: Normal
6. Set privacy: Public
7. Click "Create Session"

**Expected Results:**
- Session created successfully
- Creator automatically joined as first player  
- Redirected to session page with faction selection
- Player ID stored in sessionStorage

### 2. Player Joining  
**URL:** `http://localhost:3000/lobby` (in new browser/incognito)
**Steps:**
1. View available sessions list
2. See "Test Game Session" with 1/3 players
3. Click "Join" button
4. Should redirect to session page

**Expected Results:**
- Player successfully joins session
- Session shows 2/3 players
- Both players can see each other in waiting room
- Real-time updates show new player joined

### 3. Faction Selection
**In Session Page:**
**Steps:**
1. Both players select different factions
2. Observe real-time updates
3. Try to select same faction (should prevent conflict)

**Expected Results:**
- Faction conflicts prevented
- Real-time updates show faction selections
- Ready status updates when factions selected

### 4. Game Start
**Session Creator Actions:**
**Steps:**
1. Wait for minimum players (2) with factions
2. Click "Start Game" button
3. Validate start conditions

**Expected Results:**
- Game starts when conditions met (min 2 players, all have factions)
- Session status changes to "active"  
- All players redirected or notified of game start

### 5. Session Leave
**Player Actions:**
**Steps:**
1. Player clicks "Leave Session" in waiting room
2. Observe real-time updates

**Expected Results:**
- Player removed from session
- Session player count decreases
- Other players see updated participant list
- Redirected back to lobby

## Test Scenario 2: Edge Cases

### Session Capacity
- Try to join full session (should be prevented)
- Session shows "Full" status when at capacity

### Validation Errors  
- Try to start game with <2 players
- Try to start game with players missing factions
- Appropriate error messages displayed

### Real-time Features
- Multiple browser windows show live updates
- Player join/leave reflected immediately
- Faction selection conflicts prevented
- Connection status indicator works

## Test Scenario 3: Configuration Options

### Session Description
- Sessions with/without descriptions display correctly
- Character count validation (500 max)

### Turn Timer
- Various timer options selectable
- "No time limit" vs timed options
- Configuration stored and displayed

### Privacy Settings
- Public sessions visible in lobby
- Private/Friends settings affect visibility

## API Endpoints Testing

### Session Management
- `POST /api/lobby/create-session` - Creates session with new fields
- `POST /api/lobby/join-session` - Validates and joins player
- `POST /api/lobby/leave-session` - Removes player safely  
- `POST /api/lobby/start-game` - Validates and starts game
- `GET /api/lobby/sessions` - Returns enhanced session list

### Data Validation
- Database constraints enforced
- TypeScript types prevent invalid data
- Error handling for edge cases

## Real-time Subscription Testing

### Live Updates
- Session list updates when sessions created/closed
- Player counts update when players join/leave
- Faction selections update in real-time
- Connection status indicators work

### Connection Handling
- Graceful handling of connection failures
- Fallback to polling when real-time unavailable
- Reconnection attempts with exponential backoff

## Success Criteria Validation

✅ **Session Creation & Configuration**
- Enhanced form with all new fields
- Proper validation and error handling
- Creator auto-join functionality

✅ **Session Discovery & Joining** 
- Enhanced session browser with filters
- Real-time session updates
- Join validation and conflict prevention

✅ **Session Lifecycle Management**
- Complete waiting room experience
- Start game validation and workflow
- Leave session functionality  

✅ **Real-time Features**
- Live lobby updates
- Session participant updates
- Connection status indicators

✅ **Database Schema**
- All required fields added
- Proper constraints and indexes
- Type-safe operations

This comprehensive test suite validates all aspects of the lobby system implementation per issue #14 requirements.