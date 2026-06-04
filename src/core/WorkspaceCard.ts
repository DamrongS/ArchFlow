import { Renderer } from "./Renderer";
import { Vector2 } from "../services/Vector2";
import { Workspace } from "./Workspace";

export class WorkspaceCard {
    constructor(
        public workspace: Workspace,
        public position: Vector2,
        public size: Vector2 = new Vector2(100, 100)
    ) {}

    contains(point: Vector2): boolean {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.size.x &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.size.y
        );
    }

    draw(renderer: Renderer) {
        renderer.rect(this.position, this.size);

        renderer.text(this.workspace.name, this.position.add(new Vector2(10, 120)));
    }
}