/**
 * Stage 1: Lunar Lander
 * Inspired by Atari's 1979 classic with zoom feature
 * Now with intro undocking sequence!
 */

export default class Stage1 {
    constructor(renderer, gameState) {
        this.renderer = renderer;
        this.gameState = gameState;
        
        // Intro sequence state
        this.introPhase = 'docked';  // 'docked', 'undocking', 'zooming', 'playing'
        this.introTimer = 0;
        this.introZoom = 3.5;        // Start zoomed in on docked spacecraft
        this.undockDistance = 0;     // Separation distance during undock
        
        // Intro timing (seconds)
        this.dockedDuration = 2;
        this.undockDuration = 3;
        this.zoomOutDuration = 2;
        
        // Lander physics - start top-left, moving right
        this.lander = {
            x: 80,
            y: 60,
            vx: 50,
            vy: 10,
            rotation: 0,
            fuel: 100,
            thrust: 0
        };
        
        // Orion position (stays where HLS undocks from)
        this.orion = {
            x: 80,
            y: 60,
            rotation: 0
        };
        
        // Physics constants
        this.gravity = 25;
        this.thrustPower = 60;
        this.rotationSpeed = 2.5;
        this.maxLandingSpeed = 40;
        
        // Scoring zones
        this.innerRadius = 25;
        this.outerRadius = 60;
        
        // Zoom settings
        this.zoomThreshold = 200;
        this.maxZoom = 2.5;
        this.currentZoom = 1;
        
        // Generate randomized landing pad and terrain
        this.randomizeTerrain();
        
        // Game state
        this.gameOver = false;
        this.landed = false;
        this.crashed = false;
        this.paused = false;
        
        // Debug panel elements
        this.debugPanel = document.getElementById('debug-panel');
        this.gravitySlider = document.getElementById('gravity-slider');
        this.thrustSlider = document.getElementById('thrust-slider');
        this.fuelSlider = document.getElementById('fuel-slider');
        
        // Setup slider listeners
        this.setupDebugControls();
        
        // Input state
        this.keys = {
            thrust: false,
            left: false,
            right: false
        };
        
        // Starship HLS shape
        this.landerBody = [
            { x: 0, y: -40 },
            { x: 4, y: -35 },
            { x: 6, y: -28 },
            { x: 6, y: 20 },
            { x: -6, y: 20 },
            { x: -6, y: -28 },
            { x: -4, y: -35 }
        ];
        
        this.landingLegRight = [
            { x: 6, y: 15 },
            { x: 14, y: 28 },
            { x: 16, y: 30 }
        ];
        
        this.landingLegLeft = [
            { x: -6, y: 15 },
            { x: -14, y: 28 },
            { x: -16, y: 30 }
        ];
        
        this.landingLegCenter = [
            { x: 0, y: 20 },
            { x: 0, y: 30 }
        ];
        
        this.window = [
            { x: -3, y: -20 },
            { x: 3, y: -20 },
            { x: 3, y: -12 },
            { x: -3, y: -12 }
        ];
        
        this.flameShape = [
            { x: -5, y: 22 },
            { x: 0, y: 50 },
            { x: 5, y: 22 }
        ];
        
        this.sideFlameLeft = [
            { x: -8, y: -10 },
            { x: -18, y: -8 },
            { x: -8, y: -6 }
        ];
        
        this.sideFlameRight = [
            { x: 8, y: -10 },
            { x: 18, y: -8 },
            { x: 8, y: -6 }
        ];
        
        // Orion spacecraft shape - based on Artemis III reference
        // SCALED DOWN - Orion is much smaller than HLS Starship
        // Crew Module (wide cone, blunt nose)
        this.orionCapsule = [
            { x: 0, y: -12 },     // Nose (blunter)
            { x: 2, y: -10 },     // Upper cone
            { x: 5, y: -4 },      // Wide cone angle
            { x: 5, y: -2 },      // Heat shield top
            { x: -5, y: -2 },     // Heat shield top
            { x: -5, y: -4 },     // Wide cone angle
            { x: -2, y: -10 }     // Upper cone
        ];
        
        // Crew windows (row of small windows)
        this.orionWindows = [
            { x: -3, y: -6 },
            { x: 0, y: -7 },
            { x: 3, y: -6 }
        ];
        
        // Service Module (cylindrical, same width as capsule base)
        this.orionServiceModule = [
            { x: 5, y: -2 },      // Top right (connects to capsule)
            { x: 5, y: 10 },      // Bottom right
            { x: 3, y: 12 },      // Engine bell right
            { x: -3, y: 12 },     // Engine bell left
            { x: -5, y: 10 },     // Bottom left
            { x: -5, y: -2 }      // Top left
        ];
        
        // Four large solar panels in X-pattern (angled outward)
        // Upper-left panel (angled up-left)
        this.orionPanelUL = [
            { x: -4, y: 0 },
            { x: -22, y: -14 },
            { x: -20, y: -16 },
            { x: -3, y: -3 }
        ];
        
        // Upper-right panel (angled up-right)
        this.orionPanelUR = [
            { x: 4, y: 0 },
            { x: 22, y: -14 },
            { x: 20, y: -16 },
            { x: 3, y: -3 }
        ];
        
        // Lower-left panel (angled down-left)
        this.orionPanelLL = [
            { x: -4, y: 4 },
            { x: -22, y: 18 },
            { x: -20, y: 20 },
            { x: -3, y: 7 }
        ];
        
        // Lower-right panel (angled down-right)
        this.orionPanelLR = [
            { x: 4, y: 4 },
            { x: 22, y: 18 },
            { x: 20, y: 20 },
            { x: 3, y: 7 }
        ];
        
        // Twinkling stars
        this.stars = [];
        for (let i = 0; i < 60; i++) {
            this.stars.push({
                x: Math.random() * 800,
                y: Math.random() * 400,
                baseSize: 0.5 + Math.random() * 1.5,
                twinkleSpeed: 1 + Math.random() * 4,
                twinklePhase: Math.random() * Math.PI * 2,
                brightness: Math.random()
            });
        }
        this.starTime = 0;
    }
    
    init() {
        // Start in intro sequence
        this.introPhase = 'docked';
        this.introTimer = 0;
        this.introZoom = 3.5;
        this.undockDistance = 0;
        
        // Position lander at start for docking display
        this.lander.x = 400;  // Center screen for intro
        this.lander.y = 200;
        this.lander.vx = 0;
        this.lander.vy = 0;
        this.lander.rotation = 0;
        
        // Orion at same position initially
        this.orion.x = this.lander.x;
        this.orion.y = this.lander.y - 40;  // Above HLS (docked at nose)
        this.orion.rotation = Math.PI;       // Flipped to face HLS
        
        this.gameState.updateUI({
            score: 0,
            fuel: this.lander.fuel,
            altitude: '----'
        });
        
        // Sync sliders with initial values
        this.gravitySlider.value = this.gravity;
        document.getElementById('gravity-value').textContent = this.gravity;
        this.thrustSlider.value = this.thrustPower;
        document.getElementById('thrust-value').textContent = this.thrustPower;
        this.fuelSlider.value = this.lander.fuel;
        document.getElementById('fuel-value').textContent = Math.floor(this.lander.fuel);
    }
    
    setupDebugControls() {
        this.gravitySlider.addEventListener('input', (e) => {
            this.gravity = parseInt(e.target.value);
            document.getElementById('gravity-value').textContent = this.gravity;
        });
        
        this.thrustSlider.addEventListener('input', (e) => {
            this.thrustPower = parseInt(e.target.value);
            document.getElementById('thrust-value').textContent = this.thrustPower;
        });
        
        this.fuelSlider.addEventListener('input', (e) => {
            this.lander.fuel = parseInt(e.target.value);
            document.getElementById('fuel-value').textContent = this.lander.fuel;
            this.gameState.updateUI({ fuel: this.lander.fuel });
        });
    }
    
    togglePause() {
        if (this.introPhase !== 'playing') return;  // Can't pause during intro
        
        this.paused = !this.paused;
        if (this.paused) {
            this.debugPanel.classList.remove('hidden');
            this.fuelSlider.value = Math.floor(this.lander.fuel);
            document.getElementById('fuel-value').textContent = Math.floor(this.lander.fuel);
        } else {
            this.debugPanel.classList.add('hidden');
        }
    }
    
    randomizeTerrain() {
        this.landingPad = {
            x: 150 + Math.random() * 500,
            width: 120,
            y: 520 + (Math.random() * 20 - 10)
        };
        
        this.terrain = this.generateTerrain();
    }
    
    generateTerrain() {
        const points = [];
        const padLeft = this.landingPad.x - this.landingPad.width / 2;
        const padRight = this.landingPad.x + this.landingPad.width / 2;
        const padY = this.landingPad.y;
        
        const leftBaseY = padY + (Math.random() * 20 - 10);
        for (let x = 0; x < padLeft; x += 30) {
            const y = leftBaseY - 10 - Math.random() * 40;
            points.push({ x, y });
        }
        
        points.push({ x: padLeft, y: padY });
        points.push({ x: padRight, y: padY });
        
        const rightBaseY = padY + (Math.random() * 20 - 10);
        for (let x = padRight + 30; x <= 800; x += 30) {
            const y = rightBaseY - 10 - Math.random() * 40;
            points.push({ x, y });
        }
        
        return points;
    }
    
    handleKeyDown(code) {
        // P toggles pause (only during gameplay)
        if (code === 'KeyP') {
            this.togglePause();
            return;
        }
        
        // Space to skip intro
        if (code === 'Space' && this.introPhase !== 'playing') {
            this.skipIntro();
            return;
        }
        
        // Don't process other keys when paused or in intro
        if (this.paused || this.introPhase !== 'playing') return;
        
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
                this.debugPanel.classList.add('hidden');
                this.paused = false;
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
    
    skipIntro() {
        this.introPhase = 'playing';
        this.introZoom = 1;
        this.currentZoom = 1;
        
        // Set lander to gameplay start position
        // Keep horizontal orientation (nose pointing left, moving right)
        this.lander.x = 80;
        this.lander.y = 60;
        this.lander.vx = 50;
        this.lander.vy = 10;
        this.lander.rotation = -Math.PI / 2;  // Nose pointing left (retrograde)
        
        this.gameState.updateUI({
            altitude: this.landingPad.y - this.lander.y - 30
        });
    }
    
    update(dt) {
        dt = Math.min(dt, 0.1);
        
        // Update star twinkle time (always)
        this.starTime += dt;
        
        // Handle intro sequence
        if (this.introPhase !== 'playing') {
            this.updateIntro(dt);
            return;
        }
        
        // Don't update physics when paused or game over
        if (this.paused || this.gameOver) return;
        
        // Rotation
        if (this.keys.left) {
            this.lander.rotation -= this.rotationSpeed * dt;
        }
        if (this.keys.right) {
            this.lander.rotation += this.rotationSpeed * dt;
        }
        
        // Thrust
        if (this.keys.thrust && this.lander.fuel > 0) {
            this.lander.thrust = this.thrustPower;
            this.lander.fuel -= 15 * dt;
            if (this.lander.fuel < 0) this.lander.fuel = 0;
        } else {
            this.lander.thrust = 0;
        }
        
        // Physics
        const thrustX = Math.sin(this.lander.rotation) * this.lander.thrust;
        const thrustY = -Math.cos(this.lander.rotation) * this.lander.thrust;
        
        this.lander.vx += thrustX * dt;
        this.lander.vy += (this.gravity + thrustY) * dt;
        
        this.lander.x += this.lander.vx * dt;
        this.lander.y += this.lander.vy * dt;
        
        // Screen wrap horizontal
        if (this.lander.x < -50) this.lander.x = 850;
        if (this.lander.x > 850) this.lander.x = -50;
        
        // Keep above screen
        if (this.lander.y < 50) {
            this.lander.y = 50;
            this.lander.vy = 0;
        }
        
        // Calculate altitude and zoom
        const altitude = this.landingPad.y - this.lander.y - 30;
        
        if (altitude < this.zoomThreshold && altitude > 0) {
            const zoomProgress = 1 - (altitude / this.zoomThreshold);
            this.currentZoom = 1 + (this.maxZoom - 1) * zoomProgress;
        } else if (altitude >= this.zoomThreshold) {
            this.currentZoom = 1;
        }
        
        // Check collision
        this.checkLanding();
        
        // Update UI
        this.gameState.updateUI({
            fuel: this.lander.fuel,
            altitude: Math.max(0, altitude)
        });
    }
    
    updateIntro(dt) {
        this.introTimer += dt;
        
        switch (this.introPhase) {
            case 'docked':
                // Just showing docked spacecraft
                if (this.introTimer >= this.dockedDuration) {
                    this.introPhase = 'undocking';
                    this.introTimer = 0;
                }
                break;
                
            case 'undocking':
                // Animate separation
                const undockProgress = this.introTimer / this.undockDuration;
                this.undockDistance = undockProgress * 80;  // Move 80 pixels apart
                
                // Small RCS bursts visible during undock
                this.lander.thrust = (Math.sin(this.introTimer * 10) > 0.7) ? 20 : 0;
                
                if (this.introTimer >= this.undockDuration) {
                    this.introPhase = 'zooming';
                    this.introTimer = 0;
                    this.lander.thrust = 0;
                }
                break;
                
            case 'zooming':
                // Zoom out and transition to gameplay position
                const zoomProgress = this.introTimer / this.zoomOutDuration;
                const easeOut = 1 - Math.pow(1 - zoomProgress, 2);  // Ease out
                
                // Zoom from 3.5x down to 1x
                this.introZoom = 3.5 - (2.5 * easeOut);
                
                // Move lander from center to start position
                this.lander.x = 400 + (80 - 400) * easeOut;
                this.lander.y = 200 + (60 - 200) * easeOut;
                
                // Gradually add velocity
                this.lander.vx = 50 * easeOut;
                this.lander.vy = 10 * easeOut;
                
                // Keep rotation horizontal (nose pointing left = -PI/2)
                this.lander.rotation = -Math.PI / 2;
                
                if (this.introTimer >= this.zoomOutDuration) {
                    this.introPhase = 'playing';
                    this.introZoom = 1;
                    this.currentZoom = 1;
                    
                    // Ensure exact start values
                    this.lander.x = 80;
                    this.lander.y = 60;
                    this.lander.vx = 50;
                    this.lander.vy = 10;
                    this.lander.rotation = -Math.PI / 2;  // Nose pointing left (retrograde)
                    
                    this.gameState.updateUI({
                        altitude: this.landingPad.y - this.lander.y - 30
                    });
                }
                break;
        }
    }
    
    getTerrainHeightAt(x) {
        for (let i = 0; i < this.terrain.length - 1; i++) {
            const p1 = this.terrain[i];
            const p2 = this.terrain[i + 1];
            
            if (x >= p1.x && x <= p2.x) {
                const t = (x - p1.x) / (p2.x - p1.x);
                return p1.y + t * (p2.y - p1.y);
            }
        }
        return this.landingPad.y;
    }
    
    checkLanding() {
        const landerBottom = this.lander.y + 30;
        const groundY = this.getTerrainHeightAt(this.lander.x);
        
        if (landerBottom >= groundY) {
            this.gameOver = true;
            
            const speed = Math.sqrt(this.lander.vx ** 2 + this.lander.vy ** 2);
            const distFromCenter = Math.abs(this.lander.x - this.landingPad.x);
            const tooTilted = Math.abs(this.lander.rotation) > 0.25;
            const onPad = this.lander.x >= (this.landingPad.x - this.landingPad.width/2) &&
                          this.lander.x <= (this.landingPad.x + this.landingPad.width/2);
            
            if (speed > this.maxLandingSpeed || tooTilted || !onPad) {
                this.crashed = true;
            } else {
                this.landed = true;
                this.calculateScore(distFromCenter);
            }
            
            this.lander.y = groundY - 30;
        }
    }
    
    calculateScore(distFromCenter) {
        let score;
        
        if (distFromCenter <= this.innerRadius) {
            score = 1000;
        } else if (distFromCenter <= this.outerRadius) {
            const t = (distFromCenter - this.innerRadius) / (this.outerRadius - this.innerRadius);
            score = Math.floor(1000 - t * 500);
        } else {
            score = 250;
        }
        
        this.gameState.updateUI({ score });
    }
    
    restart() {
        // Reset to intro sequence
        this.introPhase = 'docked';
        this.introTimer = 0;
        this.introZoom = 3.5;
        this.undockDistance = 0;
        
        this.lander = {
            x: 400,
            y: 200,
            vx: 0,
            vy: 0,
            rotation: 0,
            fuel: 100,
            thrust: 0
        };
        
        this.orion.x = 400;
        this.orion.y = 160;
        this.orion.rotation = Math.PI;
        
        this.gameOver = false;
        this.landed = false;
        this.crashed = false;
        this.paused = false;
        this.currentZoom = 1;
        this.starTime = 0;
        
        this.debugPanel.classList.add('hidden');
        
        this.randomizeTerrain();
        
        this.fuelSlider.value = 100;
        document.getElementById('fuel-value').textContent = 100;
        
        this.gameState.updateUI({
            score: 0,
            fuel: 100,
            altitude: '----'
        });
    }
    
    // Transform world coordinates to screen coordinates
    worldToScreen(worldX, worldY) {
        const zoom = this.introPhase === 'playing' ? this.currentZoom : this.introZoom;
        
        if (zoom === 1) {
            return { x: worldX, y: worldY };
        }
        
        // Center point is the lander
        const centerX = this.lander.x;
        const centerY = this.lander.y;
        
        // Screen center
        const screenCenterX = 400;
        const screenCenterY = 300;
        
        const screenX = (worldX - centerX) * zoom + screenCenterX;
        const screenY = (worldY - centerY) * zoom + screenCenterY;
        
        return { x: screenX, y: screenY };
    }
    
    render() {
        const r = this.renderer;
        const ctx = r.ctx;
        
        ctx.save();
        
        // Twinkling stars
        this.stars.forEach(star => {
            const twinkle = Math.sin(this.starTime * star.twinkleSpeed + star.twinklePhase);
            const size = star.baseSize * (0.5 + 0.5 * twinkle);
            const alpha = 0.3 + 0.7 * (0.5 + 0.5 * twinkle);
            
            let color;
            if (star.brightness > 0.7) {
                color = `rgba(51, 255, 51, ${alpha})`;
            } else if (star.brightness > 0.4) {
                color = `rgba(34, 85, 34, ${alpha})`;
            } else {
                color = `rgba(60, 60, 60, ${alpha})`;
            }
            
            r.drawDot(star.x, star.y, Math.max(0.5, size), color);
        });
        
        // During intro, render docking sequence
        if (this.introPhase !== 'playing') {
            this.renderIntro(r);
            ctx.restore();
            return;
        }
        
        // Transform terrain points to screen coordinates
        const screenTerrain = this.terrain.map(p => this.worldToScreen(p.x, p.y));
        r.drawPolygon(screenTerrain, r.colors.green, false);
        
        // Landing pad markers
        const padLeft = this.landingPad.x - this.landingPad.width / 2;
        const padRight = this.landingPad.x + this.landingPad.width / 2;
        
        const padLeftScreen = this.worldToScreen(padLeft, this.landingPad.y);
        const padRightScreen = this.worldToScreen(padRight, this.landingPad.y);
        
        r.drawLine(padLeftScreen.x, padLeftScreen.y - 5 * this.currentZoom, 
                   padLeftScreen.x, padLeftScreen.y + 10 * this.currentZoom, r.colors.amber);
        r.drawLine(padRightScreen.x, padRightScreen.y - 5 * this.currentZoom, 
                   padRightScreen.x, padRightScreen.y + 10 * this.currentZoom, r.colors.amber);
        
        // Scoring zone circles
        const padCenter = this.worldToScreen(this.landingPad.x, this.landingPad.y - 15);
        r.drawCircle(padCenter.x, padCenter.y, this.innerRadius * this.currentZoom, r.colors.amber);
        r.drawCircle(padCenter.x, padCenter.y, this.outerRadius * this.currentZoom, r.colors.greenDim);
        
        // Lander position on screen
        const landerScreen = this.worldToScreen(this.lander.x, this.lander.y);
        const landerScale = this.currentZoom;
        
        // Lander
        if (!this.crashed) {
            r.drawShape(this.landerBody, landerScreen.x, landerScreen.y, 
                       this.lander.rotation, landerScale, r.colors.green);
            
            r.drawShape(this.window, landerScreen.x, landerScreen.y,
                       this.lander.rotation, landerScale, r.colors.greenDim);
            
            r.drawShape(this.landingLegRight, landerScreen.x, landerScreen.y,
                       this.lander.rotation, landerScale, r.colors.green);
            r.drawShape(this.landingLegLeft, landerScreen.x, landerScreen.y,
                       this.lander.rotation, landerScale, r.colors.green);
            r.drawShape(this.landingLegCenter, landerScreen.x, landerScreen.y,
                       this.lander.rotation, landerScale, r.colors.green);
            
            if (this.lander.thrust > 0) {
                const flameScale = (0.7 + Math.random() * 0.5) * landerScale;
                r.drawShape(this.flameShape, landerScreen.x, landerScreen.y, 
                           this.lander.rotation, flameScale, r.colors.amber);
            }
            
            if (this.keys.left) {
                const flameScale = (0.5 + Math.random() * 0.3) * landerScale;
                r.drawShape(this.sideFlameRight, landerScreen.x, landerScreen.y,
                           this.lander.rotation, flameScale, r.colors.amber);
            }
            if (this.keys.right) {
                const flameScale = (0.5 + Math.random() * 0.3) * landerScale;
                r.drawShape(this.sideFlameLeft, landerScreen.x, landerScreen.y,
                           this.lander.rotation, flameScale, r.colors.amber);
            }
        }
        
        ctx.restore();
        
        // HUD
        const vxDisplay = Math.abs(this.lander.vx).toFixed(0);
        const vyDisplay = Math.abs(this.lander.vy).toFixed(0);
        const hDir = this.lander.vx >= 0 ? '→' : '←';
        const vDir = this.lander.vy >= 0 ? '↓' : '↑';
        
        r.drawText(`H:${hDir}${vxDisplay}`, 650, 60, 18, r.colors.green);
        r.drawText(`V:${vDir}${vyDisplay}`, 720, 60, 18, r.colors.green);
        
        if (this.currentZoom > 1.1) {
            r.drawText(`ZOOM: ${this.currentZoom.toFixed(1)}x`, 350, 60, 18, r.colors.amber);
        }
        
        // Game over
        if (this.gameOver) {
            if (this.landed) {
                r.drawText('LANDED!', 330, 280, 36, r.colors.amber);
            } else {
                r.drawText('CRASHED!', 320, 280, 36, r.colors.amber);
            }
            r.drawText('PRESS R TO RETRY', 300, 320, 24, r.colors.green);
            r.drawText('ESC FOR MENU', 320, 355, 20, r.colors.greenDim);
        }
        
        // Controls hint
        if (!this.gameOver && !this.paused && this.lander.y < 120 && this.currentZoom === 1) {
            r.drawText('ARROWS/WASD TO CONTROL  -  P TO PAUSE', 180, 570, 18, r.colors.greenDim);
        }
    }
    
    renderIntro(r) {
        const zoom = this.introZoom;
        
        // Screen center
        const screenCenterX = 400;
        const screenCenterY = 300;
        
        // HLS rotation: -PI/2 = nose pointing LEFT (horizontal, parallel to moon surface)
        const hlsRotation = -Math.PI / 2;
        // Orion rotation: PI/2 = nose pointing RIGHT (toward HLS for docking)
        const orionRotation = Math.PI / 2;
        
        // During zooming phase, transition to gameplay
        if (this.introPhase === 'zooming') {
            const landerScreen = this.worldToScreen(this.lander.x, this.lander.y);
            
            // Keep horizontal orientation throughout (nose pointing left)
            // Draw HLS at transitioning position
            r.drawShape(this.landerBody, landerScreen.x, landerScreen.y, hlsRotation, zoom, r.colors.green);
            r.drawShape(this.window, landerScreen.x, landerScreen.y, hlsRotation, zoom, r.colors.greenDim);
            r.drawShape(this.landingLegRight, landerScreen.x, landerScreen.y, hlsRotation, zoom, r.colors.green);
            r.drawShape(this.landingLegLeft, landerScreen.x, landerScreen.y, hlsRotation, zoom, r.colors.green);
            r.drawShape(this.landingLegCenter, landerScreen.x, landerScreen.y, hlsRotation, zoom, r.colors.green);
            
            // Draw terrain coming into view
            const screenTerrain = this.terrain.map(p => this.worldToScreen(p.x, p.y));
            r.drawPolygon(screenTerrain, r.colors.green, false);
            
            // Landing pad markers
            const padLeft = this.landingPad.x - this.landingPad.width / 2;
            const padRight = this.landingPad.x + this.landingPad.width / 2;
            const padLeftScreen = this.worldToScreen(padLeft, this.landingPad.y);
            const padRightScreen = this.worldToScreen(padRight, this.landingPad.y);
            
            r.drawLine(padLeftScreen.x, padLeftScreen.y - 5 * zoom, 
                       padLeftScreen.x, padLeftScreen.y + 10 * zoom, r.colors.amber);
            r.drawLine(padRightScreen.x, padRightScreen.y - 5 * zoom, 
                       padRightScreen.x, padRightScreen.y + 10 * zoom, r.colors.amber);
        } else {
            // Docked or undocking phase
            // HLS and Orion are horizontal, side by side
            // Orion is to the LEFT (nose pointing right), HLS to the RIGHT (nose pointing left)
            // They are docked nose-to-nose
            
            // Base positions (docked at center)
            // HLS is much larger - nose at y=-40, Orion nose at y=-12
            const hlsDockOffset = 42;   // HLS center offset from dock point
            const orionDockOffset = 14; // Orion center offset from dock point (much smaller)
            
            let hlsScreenX = screenCenterX + hlsDockOffset * zoom;
            let hlsScreenY = screenCenterY;
            let orionScreenX = screenCenterX - orionDockOffset * zoom;
            let orionScreenY = screenCenterY;
            
            if (this.introPhase === 'undocking') {
                // HLS moves DOWN (toward moon), Orion stays in orbit
                hlsScreenY = screenCenterY + this.undockDistance * zoom;
            }
            
            // Draw Orion spacecraft (nose pointing right = PI/2)
            r.drawShape(this.orionCapsule, orionScreenX, orionScreenY, orionRotation, zoom, r.colors.green);
            r.drawShape(this.orionServiceModule, orionScreenX, orionScreenY, orionRotation, zoom, r.colors.green);
            
            // Draw crew windows
            this.orionWindows.forEach(w => {
                const cos = Math.cos(orionRotation);
                const sin = Math.sin(orionRotation);
                const wx = orionScreenX + (w.x * cos - w.y * sin) * zoom;
                const wy = orionScreenY + (w.x * sin + w.y * cos) * zoom;
                r.drawDot(wx, wy, 1.5 * zoom, r.colors.amber);
            });
            
            // Draw four solar panels in X-pattern
            r.drawShape(this.orionPanelUL, orionScreenX, orionScreenY, orionRotation, zoom, r.colors.greenDim);
            r.drawShape(this.orionPanelUR, orionScreenX, orionScreenY, orionRotation, zoom, r.colors.greenDim);
            r.drawShape(this.orionPanelLL, orionScreenX, orionScreenY, orionRotation, zoom, r.colors.greenDim);
            r.drawShape(this.orionPanelLR, orionScreenX, orionScreenY, orionRotation, zoom, r.colors.greenDim);
            
            // Draw HLS (nose pointing left = -PI/2)
            r.drawShape(this.landerBody, hlsScreenX, hlsScreenY, hlsRotation, zoom, r.colors.green);
            r.drawShape(this.window, hlsScreenX, hlsScreenY, hlsRotation, zoom, r.colors.greenDim);
            r.drawShape(this.landingLegRight, hlsScreenX, hlsScreenY, hlsRotation, zoom, r.colors.green);
            r.drawShape(this.landingLegLeft, hlsScreenX, hlsScreenY, hlsRotation, zoom, r.colors.green);
            r.drawShape(this.landingLegCenter, hlsScreenX, hlsScreenY, hlsRotation, zoom, r.colors.green);
            
            // Small RCS burst during undocking (fire downward thrusters)
            if (this.introPhase === 'undocking' && this.lander.thrust > 0) {
                const flameScale = 0.3 * zoom;
                // Draw main engine firing (pushing HLS down toward moon)
                r.drawShape(this.flameShape, hlsScreenX, hlsScreenY, hlsRotation, flameScale * 0.5, r.colors.amber);
            }
        }
        
        // Intro text
        if (this.introPhase === 'docked') {
            r.drawText('ORION + HLS DOCKED', 290, 500, 24, r.colors.amber);
            r.drawText('LUNAR ORBIT', 340, 530, 18, r.colors.greenDim);
        } else if (this.introPhase === 'undocking') {
            r.drawText('UNDOCKING...', 330, 500, 24, r.colors.amber);
        } else if (this.introPhase === 'zooming') {
            r.drawText('BEGINNING DESCENT', 300, 500, 24, r.colors.amber);
        }
        
        // Skip hint
        r.drawText('SPACE TO SKIP', 330, 570, 16, r.colors.greenDim);
    }
}
