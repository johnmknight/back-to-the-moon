# Back to the Moon! 🌙

A retro-style browser game celebrating NASA's Artemis missions. Features classic CRT vector graphics reminiscent of Battlezone and Asteroids.

## Stages

### Stage 1: Lunar Lander
A modernized take on the classic lunar lander game. Guide your spacecraft to the Artemis landing zone near the lunar south pole. One landing site with a scoring zone - the closer to center, the higher your score.

### Stage 2: Moon Patrol
Side-scrolling lunar rover adventure across the regolith. Navigate craters and obstacles in classic arcade style.

### Stage 3: TBD
Coming soon...

## Tech Stack

- **Client**: HTML5 Canvas, JavaScript (vector graphics rendering)
- **Server**: Python (FastAPI)
- **Style**: CRT vector aesthetic (green/amber phosphor lines on black)

## Project Structure

```
back-to-the-moon/
├── server/          # Python FastAPI backend
├── client/          # Browser game (HTML/JS/Canvas)
├── assets/          # Vector art definitions, sounds
└── docs/            # Game design documentation
```

## Getting Started

### Server
```bash
cd server
pip install -r requirements.txt
python main.py
```

### Client
Open `client/index.html` in a browser, or serve via the Python backend.

## License

MIT

## Acknowledgments

Inspired by NASA's Artemis program - humanity's return to the Moon.
