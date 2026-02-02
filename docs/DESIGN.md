# Back to the Moon! - Game Design Document

## Overview
A browser-based arcade game celebrating NASA's Artemis program. Three stages of increasing complexity, all rendered in classic CRT vector graphics style (green phosphor on black, like Battlezone/Asteroids).

---

## Visual Style

### CRT Vector Aesthetic
- **Primary color**: Phosphor green (#33ff33) with glow effect
- **Secondary color**: Amber (#ffaa00) for highlights, warnings, scores
- **Background**: Near-black (#0a0a0a)
- **Effects**: 
  - Scanline overlay
  - Phosphor bloom/glow on all lines
  - Subtle flicker animation
  - Line-based rendering (no filled shapes)

### Typography
- VT323 or similar monospace pixel/vector font
- All caps for UI elements
- Consistent glow effect on text

---

## Stage 1: Lunar Lander

### Concept
Modern take on the 1979 Atari classic. Guide the Artemis HLS (Human Landing System) to a safe landing near the lunar south pole.

### Gameplay
- **Objective**: Land within the target zone
- **Controls**: 
  - Arrow keys or WASD for rotation
  - Up/W for thrust
- **Physics**: 
  - Lunar gravity (~1.62 m/s², scaled for gameplay)
  - Momentum-based movement
  - Fuel consumption on thrust

### Scoring
- Single landing zone with bullseye target
- **1000 points**: Perfect center landing
- **250-750 points**: Within outer zone (linear falloff)
- **0 points**: Crash or outside zone
- No fuel bonus (simplification from original)

### Win/Lose Conditions
- **Success**: Land within zone, under speed limit, upright
- **Crash**: 
  - Too fast (> 30 units/s)
  - Too tilted (> 17°)
  - Outside landing zone

### Visual Elements
- Vector lander (Artemis HLS inspired shape)
- Terrain with flat landing pad area
- Concentric circle landing zone
- Star field background
- Thrust flame effect

---

## Stage 2: Moon Patrol

### Concept
Side-scrolling rover adventure across the lunar surface. Inspired by the 1982 Irem arcade game.

### Gameplay (Planned)
- **Objective**: Traverse the lunar landscape, avoid/destroy obstacles
- **Controls**:
  - Left/Right movement (auto-scroll)
  - Jump
  - Shoot (upward and forward)
  
### Obstacles (Planned)
- Craters (jump over)
- Boulders (shoot or jump)
- UFOs (shoot)
- Meteors (falling hazards)

### Visual Elements
- Side-view vector terrain
- Animated rover with wheels
- Parallax star background
- Crater silhouettes

---

## Stage 3: TBD

### Ideas Under Consideration
1. **Orbital Rendezvous**: Dock with Gateway station
2. **Sample Return**: Navigate asteroid field
3. **Base Builder**: Quick resource gathering/building
4. **Escape Velocity**: Launch from lunar surface

---

## Technical Architecture

### Client
- HTML5 Canvas for rendering
- ES6 modules for code organization
- No external frameworks (vanilla JS)
- RequestAnimationFrame game loop

### Server (Python/FastAPI)
- High score storage and retrieval
- Player authentication (optional)
- Leaderboards per stage
- Game state persistence (optional)

### API Endpoints
```
GET  /api/health         - Server status
GET  /api/highscores     - All stage scores
POST /api/highscores/:stage - Submit score
```

---

## Future Enhancements

### Audio (Post-MVP)
- Retro synth sound effects
- Thrust rumble
- Landing/crash sounds
- Simple background music

### Additional Features
- Touch controls for mobile
- Difficulty settings
- Achievement system
- Multiplayer high score competition
- Replay recording

---

## References
- Original Lunar Lander (Atari, 1979)
- Moon Patrol (Irem, 1982)
- Battlezone (Atari, 1980) - visual style
- Asteroids (Atari, 1979) - visual style
- NASA Artemis Program - theme/inspiration
