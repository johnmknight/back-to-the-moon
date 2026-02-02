/**
 * Stage 1: Lunar Lander
 * Land on the Artemis landing zone near the lunar south pole.
 * Closer to center = more points. No fuel bonus.
 */

export default class Stage1 {
    constructor(renderer, gameState) {
        this.renderer = renderer;
        this.gameState = gameState;
        
        // Lander physics
        this.lander = {
            x: 400,
            y: 50,
            vx: 0,
            vy: 0,
            rotation: 0,
            fuel: 100,
            thrust: 0,
            rotationThrust: 0
        };
        
        // Physics constants
        this.gravity = 20;        // Lunar gravity (pixels/s²)
        this.thrustPower = 50;    // Thrust acceleration
        this.rotationSpeed = 3;   // Radians per second
        this.maxLandingSpeed = 30; // Max safe vertical landing speed
        
        // Landing zone
        this.landingZone = {
            x: 400,
            y: 550,
            innerRadius: 20,   // Bullseye - max points
            outerRadius: 80    // Outer zone - min points
        };
        
        // Terrain (simple for now)
        this.terrain = this.generateTerrain();
        
        // Game state
        this.gameOver = false;
        this.landed = false;
        this.crashed = false;
        
        // Input state
        this.keys = {
            thrust: false,
            left: false,
            right: false
        };
        
        // Lander shape (vector points)
        this.landerShape = [
            { x: 0, y: -15 },   // Top
            { x: 10, y: 10 },   // Bottom right
            { x: 5, y: 10 },    // Inner right
            { x: 5, y: 15 },    // Leg right
            { x: -5, y: 15 },   // Leg left
            { x: -5, y: 10 },   // Inner left
            { x: -10, y: 10 }   // Bottom left
        ];
        
        // Thrust flame shape
        this.flameShape = [
            { x: -5, y: 12 },
            { x: 0, y: 25 },
            { x: 5, y: 12 }
        ];
    }
    
    init() {
        this.gameState.updateUI({
            score: 0,
            fuel: this.lander.fuel,
            altitude: this.lander.y
        });
    }
    
    generateTerrain() {
        const points = [];
        const segments = 40;
        const width = this.renderer.width;
        const baseY = 560;
        
        for (let i = 0; i <= segments; i++) {
            const x = (i / segments) * width;
            let y = baseY;
            
            // Create flat landing area in center
            const distFromCenter = Math.abs(x - this.landingZone.x);
            if (distFromCenter > this.landingZone.outerRadius) {
                // Rough terrain
                y = baseY - Math.random() * 40 - 10;
            }
            
            points.push({ x, y });
        }
        
        return points;
    }
    
    handleKeyDown(code) {
        switch (code) {
            case 'ArrowUp':
            case 'KeyW':
                this.keys.thrust = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keys.right = true;
                break;
            case 'KeyR':
                if (this.gameOver) this.restart();
                break;
            case 'Escape':
                this.gameState.returnToMenu();
                break;
        }
    }
    
    handleKeyUp(code) {
        switch (code) {
            case 'ArrowUp':
            case 'KeyW':
                this.keys.thrust = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keys.right = false;
                break;
        }
    }
    
    update(dt) {
        if (this.gameOver) return;
        
        // Handle rotation
        if (this.keys.left) {
            this.lander.rotation -= this.rotationSpeed * dt;
        }
        if (this.keys.right) {
            this.lander.rotation += this.rotationSpeed * dt;
        }
        
        // Handle thrust
        if (this.keys.thrust && this.lander.fuel > 0) {
            this.lander.thrust = this.thrustPower;
            this.lander.fuel -= 20 * dt;  // Fuel consumption
            if (this.lander.fuel < 0) this.lander.fuel = 0;
        } else {
            this.lander.thrust = 0;
        }
        
        // Apply physics
        // Thrust is applied in the direction the lander is pointing
        const thrustX = Math.sin(this.lander.rotation) * this.lander.thrust;
        const thrustY = -Math.cos(this.lander.rotation) * this.lander.thrust;
        
        this.lander.vx += thrustX * dt;
        this.lander.vy += (this.gravity + thrustY) * dt;
        
        this.lander.x += this.lander.vx * dt;
        this.lander.y += this.lander.vy * dt;
        
        // Screen wrapping (horizontal only)
        if (this.lander.x < 0) this.lander.x = this.renderer.width;
        if (this.lander.x > this.renderer.width) this.lander.x = 0;
        
        // Check collision with terrain
        this.checkLanding();
        
        // Update UI
        const altitude = this.landingZone.y - this.lander.y - 15;
        this.gameState.updateUI({
            fuel: this.lander.fuel,
            altitude: Math.max(0, altitude)
        });
    }
    
    checkLanding() {
        const landerBottom = this.lander.y + 15;
        
        // Simple ground check at landing zone level
        if (landerBottom >= this.landingZone.y) {
            this.gameOver = true;
            
            const speed = Math.sqrt(this.lander.vx ** 2 + this.lander.vy ** 2);
            const distFromCenter = Math.abs(this.lander.x - this.landingZone.x);
            const tooTilted = Math.abs(this.lander.rotation) > 0.3; // ~17 degrees
            
            // Check landing conditions
            if (speed > this.maxLandingSpeed || tooTilted || distFromCenter > this.landingZone.outerRadius) {
                this.crashed = true;
            } else {
                this.landed = true;
                this.calculateScore(distFromCenter);
            }
        }
    }
    
    calculateScore(distFromCenter) {
        let score = 0;
        
        if (distFromCenter <= this.landingZone.innerRadius) {
            // Bullseye!
            score = 1000;
        } else {
            // Linear falloff from inner to outer radius
            const t = (distFromCenter - this.landingZone.innerRadius) / 
                      (this.landingZone.outerRadius - this.landingZone.innerRadius);
            score = Math.floor(1000 * (1 - t) * 0.5 + 250); // 250-750 points
        }
        
        this.gameState.updateUI({ score });
    }
    
    restart() {
        this.lander = {
            x: 400,
            y: 50,
            vx: (Math.random() - 0.5) * 20, // Random starting drift
            vy: 0,
            rotation: 0,
            fuel: 100,
            thrust: 0
        };
        this.gameOver = false;
        this.landed = false;
        this.crashed = false;
        
        this.gameState.updateUI({
            score: 0,
            fuel: 100,
            altitude: this.lander.y
        });
    }
    
    render() {
        const r = this.renderer;
        
        // Draw stars (simple background)
        this.drawStars();
        
        // Draw terrain
        r.drawPolygon(this.terrain, r.colors.green, false);
        
        // Draw landing zone circles
        r.drawCircle(this.landingZone.x, this.landingZone.y - 5, 
                     this.landingZone.innerRadius, r.colors.amber);
        r.drawCircle(this.landingZone.x, this.landingZone.y - 5, 
                     this.landingZone.outerRadius, r.colors.greenDim);
        
        // Draw lander
        if (!this.crashed) {
            r.drawShape(this.landerShape, this.lander.x, this.lander.y, 
                       this.lander.rotation, 1, r.colors.green);
            
            // Draw thrust flame
            if (this.lander.thrust > 0) {
                const flameScale = 0.8 + Math.random() * 0.4; // Flickering
                r.drawShape(this.flameShape, this.lander.x, this.lander.y, 
                           this.lander.rotation, flameScale, r.colors.amber);
            }
        }
        
        // Draw game over message
        if (this.gameOver) {
            if (this.landed) {
                r.drawText('LANDED!', 320, 280, 40, r.colors.amber);
                r.drawText('PRESS R TO RETRY', 290, 330, 24);
            } else {
                r.drawText('CRASHED!', 310, 280, 40, r.colors.amber);
                r.drawText('PRESS R TO RETRY', 290, 330, 24);
            }
            r.drawText('ESC FOR MENU', 310, 360, 20);
        }
        
        // Draw controls hint
        if (!this.gameOver && this.lander.y < 100) {
            r.drawText('ARROWS/WASD TO CONTROL', 260, 580, 18, r.colors.greenDim);
        }
    }
    
    drawStars() {
        // Simple static stars (could be improved with actual star field)
        const r = this.renderer;
        const starPositions = [
            [50, 30], [120, 80], [200, 40], [280, 100], [350, 60],
            [450, 90], [520, 35], [600, 75], [680, 50], [750, 95],
            [80, 150], [180, 180], [300, 160], [420, 140], [550, 170],
            [650, 130], [720, 190]
        ];
        
        starPositions.forEach(([x, y]) => {
            r.drawCircle(x, y, 1, r.colors.greenDim);
        });
    }
}
