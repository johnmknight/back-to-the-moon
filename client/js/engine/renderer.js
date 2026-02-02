/**
 * Vector Graphics Renderer - CRT Phosphor Style (Clean)
 */

export class VectorRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        
        // Vector colors
        this.colors = {
            green: '#33ff33',
            greenDim: '#225522',
            amber: '#ffaa00',
            white: '#ffffff'
        };
        
        this.defaultColor = this.colors.green;
        this.lineWidth = 1.5;
    }
    
    clear() {
        // Reset all canvas state
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'transparent';
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    /**
     * Draw a line
     */
    drawLine(x1, y1, x2, y2, color = null) {
        const c = color || this.defaultColor;
        this.ctx.strokeStyle = c;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.globalAlpha = 1;
        
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
        
        const c = color || this.defaultColor;
        this.ctx.strokeStyle = c;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.globalAlpha = 1;
        
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        if (close) this.ctx.closePath();
        this.ctx.stroke();
    }
    
    /**
     * Draw text
     */
    drawText(text, x, y, size = 20, color = null) {
        const c = color || this.defaultColor;
        this.ctx.fillStyle = c;
        this.ctx.font = `${size}px "VT323", monospace`;
        this.ctx.globalAlpha = 1;
        this.ctx.fillText(text, x, y);
    }
    
    /**
     * Draw a circle
     */
    drawCircle(x, y, radius, color = null) {
        const c = color || this.defaultColor;
        this.ctx.strokeStyle = c;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.globalAlpha = 1;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    /**
     * Draw a filled circle (for stars)
     */
    drawDot(x, y, radius, color = null) {
        const c = color || this.defaultColor;
        this.ctx.fillStyle = c;
        this.ctx.globalAlpha = 1;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
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
