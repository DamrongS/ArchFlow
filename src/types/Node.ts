import { Vector2 } from "../services/Vector2";
import { Renderer } from "../core/Renderer";
import { Settings } from "../core/config/Settings";

export enum NodeState {
    Normal,
    Hovered,
    Selected,
    Spawning
}

export class Node {
    state: NodeState;
    private currentSize: Vector2;
    private spawnTime = 0;
    private spawnDuration = 0.25;
    constructor(
        public position: Vector2,
        public size: Vector2,
        public title: string,
        public fromSize: Vector2 = size
    ) {
        this.state = NodeState.Spawning;
        this.currentSize = this.fromSize.copy();
        this.spawnTime = 0;
        this.spawnDuration = 0.15;
    }

    containsPoint(point: Vector2): boolean {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.size.x &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.size.y
        );
    }

    draw(renderer: Renderer, position: Vector2, cameraZoom: number = 1, dt: number) {
        let backgroundColor = Settings.Theme.Node.Background;
        let borderColor = Settings.Theme.Node.Border;

        if (this.state === NodeState.Selected) {
            backgroundColor = Settings.Theme.Node.SelectedBackground;
            borderColor = Settings.Theme.Node.SelectedBorder;
        }

        if (this.state === NodeState.Hovered) {
            backgroundColor = Settings.Theme.Node.HoverBackground;
            borderColor = Settings.Theme.Node.HoverBorder;
        }

        if (this.state === NodeState.Spawning) {
            this.spawnTime += dt;

            const t = Math.min(this.spawnTime / this.spawnDuration, 1);

            this.currentSize = this.fromSize.lerp(this.size.mult(cameraZoom), t);

            if (t >= 1) {
                this.state = NodeState.Normal;
            }

            renderer.rect(position, this.currentSize, backgroundColor, borderColor, 10 * cameraZoom);
            renderer.text(this.title, position.add(new Vector2(10 * cameraZoom, 20 * cameraZoom)), 14, Settings.Theme.Node.Text, cameraZoom);

        } else {
            renderer.rect(position, this.size.mult(cameraZoom), backgroundColor, borderColor, 10 * cameraZoom);
            renderer.text(this.title, position.add(new Vector2(10 * cameraZoom, 20 * cameraZoom)), 14, Settings.Theme.Node.Text, cameraZoom);
        }

        console.log(this.state);

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