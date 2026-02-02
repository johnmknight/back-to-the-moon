/**
 * Vector Graphics Renderer - CRT Phosphor Style
 */

export class VectorRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        
        // Vector colors
        this.colors = {
            green: '#33ff33',
            greenDim: '#115511',
            amber: '#ffaa00',
            white: '#ffffff'
        };
        
        this.defaultColor = this.colors.green;
        this.lineWidth = 2;
    }
    
    clear() {
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    setColor(color) {
        this.ctx.strokeStyle = color || this.defaultColor;
        this.ctx.fillStyle = color || this.defaultColor;
    }
    
    /**
     * Draw a line with phosphor glow effect
     */
    drawLine(x1, y1, x2, y2, color = null) {
        this.setColor(color || this.defaultColor);
        
        // Glow effect (wider, dimmer line underneath)
        this.ctx.globalAlpha = 0.3;
        this.ctx.lineWidth = this.lineWidth * 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        // Main line
        this.ctx.globalAlpha = 1;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    
    /**
     * Draw a polygon from an array of points
     */
    drawPolygon(points, color = null, close = true) {
        if (points.length < 2) return;
        
        this.setColor(color || this.defaultColor);
        
        // Glow effect
        this.ctx.globalAlpha = 0.3;
        this.ctx.lineWidth = this.lineWidth * 3;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        if (close) this.ctx.closePath();
        this.ctx.stroke();
        
        // Main lines
        this.ctx.globalAlpha = 1;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        if (close) this.ctx.closePath();
        this.ctx.stroke();
    }
    
    /**
     * Draw text with phosphor glow
     */
    drawText(text, x, y, size = 20, color = null) {
        this.setColor(color || this.defaultColor);
        this.ctx.font = `${size}px "VT323", monospace`;
        
        // Glow
        this.ctx.globalAlpha = 0.5;
        this.ctx.shadowColor = color || this.defaultColor;
        this.ctx.shadowBlur = 10;
        this.ctx.fillText(text, x, y);
        
        // Main text
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
        this.ctx.fillText(text, x, y);
    }
    
    /**
     * Draw a circle (for landing zone, etc.)
     */
    drawCircle(x, y, radius, color = null) {
        this.setColor(color || this.defaultColor);
        
        // Glow
        this.ctx.globalAlpha = 0.3;
        this.ctx.lineWidth = this.lineWidth * 3;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Main
        this.ctx.globalAlpha = 1;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    /**
     * Transform and draw a shape at position with rotation
     */
    drawShape(shape, x, y, rotation = 0, scale = 1, color = null) {
        const transformed = shape.map(point => {
            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);
            return {
                x: x + (point.x * cos - point.y * sin) * scale,
                y: y + (point.x * sin + point.y * cos) * scale
            };
        });
        this.drawPolygon(transformed, color);
    }
}
