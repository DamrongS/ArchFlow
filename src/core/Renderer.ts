import { Vector2 } from "../services/Vector2";
import { Settings } from "./config/Settings";

export class Renderer {
    constructor(private ctx: CanvasRenderingContext2D) {

    }

    line(start: Vector2, end: Vector2, color: string = Settings.Theme.Grid.Minor) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);

        this.ctx.lineTo(end.x, end.y);
        
        this.ctx.stroke();
    }

    rect(position: Vector2, size: Vector2, color: string = Settings.Theme.Node.Background, border: string = Settings.Theme.Node.Border, borderRadius: number = 0) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = border;

        this.ctx.fillRect(position.x, position.y, size.x, size.y);
        this.ctx.strokeRect(position.x, position.y, size.x, size.y);
    }

    text(text: string, position: Vector2, size: number = 14, color: string = Settings.Theme.Node.Text, cameraZoom: number = 1) {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size * cameraZoom}px Arial`;
        this.ctx.fillText(text, position.x, position.y);
    }
}