import { Vector2 } from "../services/Vector2";
import { Renderer } from "../core/Renderer";
import { Settings } from "../core/config/Settings";

export enum NodeState {
    Normal,
    Hovered,
    Selected
}

export class Node {
    state: NodeState;
    constructor(
        public position: Vector2,
        public size: Vector2,
        public title: string
    ) {
        this.state = NodeState.Normal;
    }

    containsPoint(point: Vector2): boolean {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.size.x &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.size.y
        );
    }

    draw(renderer: Renderer, position: Vector2, cameraZoom: number = 1) {
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

        renderer.rect(position, this.size.mult(cameraZoom), backgroundColor, borderColor, 10 * cameraZoom);
        renderer.text(this.title, position.add(new Vector2(10 * cameraZoom, 20 * cameraZoom)), 14, Settings.Theme.Node.Text, cameraZoom);
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
        if (this.state !== NodeState.Selected) {
            this.state = NodeState.Hovered;
        }
    }

    unhover() {
        if (this.state === NodeState.Hovered) {
            this.state = NodeState.Normal;
        }
    }

    move(position: Vector2) {
        this.position = position;
    }
}