import { Vector2 } from "../services/Vector2";
import { Renderer } from "../core/Renderer";
import { Settings } from "../core/config/Settings";

export class Node {
    constructor(
        public position: Vector2,
        public size: Vector2,
        public title: string
    ) {}

    containsPoint(point: Vector2): boolean {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.size.x &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.size.y
        );
    }

    draw(renderer: Renderer, position: Vector2, cameraZoom: number = 1) {

        renderer.rect(position, this.size.mult(cameraZoom), Settings.Theme.Node.Background, Settings.Theme.Node.Border, 10 * cameraZoom);
        renderer.text(this.title, position.add(new Vector2(10 * cameraZoom, 20 * cameraZoom)), 14, Settings.Theme.Node.Text, cameraZoom);
    }

    setPosition(newPosition: Vector2) {
        this.position = newPosition;
    }
}