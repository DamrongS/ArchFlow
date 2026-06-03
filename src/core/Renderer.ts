import { Vector2 } from "../services/Vector2";

export class Renderer {
    constructor(private ctx: CanvasRenderingContext2D) {

    }

    line(start: Vector2, end: Vector2, color: string = "#ffffff") {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);

        this.ctx.lineTo(end.x, end.y);
        
        this.ctx.stroke();
    }
}