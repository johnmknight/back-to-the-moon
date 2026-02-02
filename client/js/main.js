/**
 * Back to the Moon! - Main Game Entry Point
 */

import { VectorRenderer } from './engine/renderer.js';
import { GameState } from './engine/state.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size FIRST
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Now create renderer (it reads canvas dimensions)
        this.renderer = new VectorRenderer(this.ctx);
        this.state = new GameState();
        
        this.setupEventListeners();
        this.lastTime = 0;
        this.running = false;
    }
    
    setupEventListeners() {
        document.getElementById('btn-stage1').addEventListener('click', () => {
            this.startStage(1);
        });
        
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    handleKeyDown(event) {
        if (this.state.currentStage) {
            this.state.currentStage.handleKeyDown(event.code);
        }
    }
    
    handleKeyUp(event) {
        if (this.state.currentStage) {
            this.state.currentStage.handleKeyUp(event.code);
        }
    }
    
    startStage(stageNum) {
        document.getElementById('menu-screen').classList.remove('active');
        
        import(`./stages/stage${stageNum}.js`).then(module => {
            this.state.currentStage = new module.default(this.renderer, this.state);
            this.state.currentStage.init();
            
            if (!this.running) {
                this.running = true;
                this.lastTime = performance.now();
                requestAnimationFrame((t) => this.gameLoop(t));
            }
        });
    }
    
    gameLoop(timestamp) {
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        
        // Clear entire canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, 800, 600);
        
        // Update and render current stage
        if (this.state.currentStage) {
            this.state.currentStage.update(deltaTime);
            this.state.currentStage.render();
        }
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
