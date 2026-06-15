import { Vector2 } from "../services/Vector2";
import { Renderer } from "../core/Renderer";
import { AssetManager } from "../core/AssetManager";

export enum NodeState {
    Normal,
    Hovered,
    Selected,
    Spawning
}

export class Nexus {
    state: NodeState;
    private currentSize: Vector2;
    private spawnTime = 0;
    private spawnDuration = 0.25;
    constructor(
        public position: Vector2,
        public zoom: number,
        public name: string,
        public fromSize: Vector2 = new Vector2(64, 64)
    ) {
        this.state = NodeState.Spawning;
        this.currentSize = this.fromSize.copy();
        this.spawnTime = 0;
        this.spawnDuration = 0.15;
    }

    size = new Vector2(64, 64);

    containsPoint(point: Vector2): boolean {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.size.x &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.size.y
        );
    }

    draw(renderer: Renderer, screenPosition: Vector2, cameraZoom: number = 1, dt: number) {
        let imagePosition = screenPosition
        let imageSize = new Vector2(64, 64).mult(cameraZoom)

        let textPosition = imagePosition.add(new Vector2(0, 80).mult(cameraZoom))
        let textSize = 14 * cameraZoom

        if (this.state === NodeState.Spawning) {
            this.spawnTime += dt;

            const t = Math.min(this.spawnTime / this.spawnDuration, 1);

            this.currentSize = this.fromSize.lerp(this.size.mult(cameraZoom), t);

            if (t >= 1) {
                this.state = NodeState.Normal;
            }

            renderer.image(AssetManager.getImage("nexus"), imagePosition, this.currentSize);

        } else {
            renderer.image(AssetManager.getImage("nexus"), imagePosition, imageSize);
            renderer.text(this.name, textPosition, textSize);
        }
    }

    setPosition(newPosition: Vector2) {
        this.position = newPosition;
    }

    select() {
        this.state = NodeState.Selected;
    }

    deselect() {
        this.state = NodeState.Normal;
    }

    hover() {
        if (this.state == NodeState.Spawning) return
        if (this.state !== NodeState.Selected) {
            this.state = NodeState.Hovered;
        }
    }

    unhover() {
        if (this.state == NodeState.Spawning) return
        if (this.state === NodeState.Hovered) {
            this.state = NodeState.Normal;
        }
    }

    move(position: Vector2) {
        this.position = position;
    }
}