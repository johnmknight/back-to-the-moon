/**
 * Game State Management
 */

export class GameState {
    constructor() {
        this.currentStage = null;
        this.score = 0;
        this.totalScore = 0;
        this.stagesCompleted = [];
        
        // UI references
        this.uiScore = document.getElementById('score');
        this.uiFuel = document.getElementById('fuel');
        this.uiAltitude = document.getElementById('altitude');
    }
    
    updateUI(data) {
        if (data.score !== undefined) {
            this.score = data.score;
            this.uiScore.textContent = `SCORE: ${Math.floor(data.score)}`;
        }
        if (data.fuel !== undefined) {
            this.uiFuel.textContent = `FUEL: ${Math.floor(data.fuel)}%`;
        }
        if (data.altitude !== undefined) {
            this.uiAltitude.textContent = `ALT: ${String(Math.floor(data.altitude)).padStart(4, '0')}`;
        }
    }
    
    stageComplete(stageNum, score) {
        this.stagesCompleted.push(stageNum);
        this.totalScore += score;
        
        // Enable next stage button if available
        const nextBtn = document.getElementById(`btn-stage${stageNum + 1}`);
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }
    
    returnToMenu() {
        this.currentStage = null;
        document.getElementById('menu-screen').classList.add('active');
    }
}
