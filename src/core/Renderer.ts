import { Vector2 } from "../services/Vector2";
import { Settings } from "./config/Settings";

export enum ImageMode {
    Corner,
    Center
}

export class Renderer {
    imageMode: ImageMode = ImageMode.Corner
    constructor(private ctx: CanvasRenderingContext2D) {

    }

    line(start: Vector2, end: Vector2, color: string = Settings.Theme.Grid.Minor, width: number = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;

        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();

        this.ctx.lineWidth = 1;
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

    image(image: HTMLImageElement, position: Vector2, size: Vector2) {
        let drawPosition = position;

        if (this.imageMode === ImageMode.Center) {
            drawPosition = position.sub(size.div(2));
        }

        this.ctx.drawImage(
            image,
            position.x,
            position.y,
            size.x,
            size.y
        );
    }
}