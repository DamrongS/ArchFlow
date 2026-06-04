import { Vector2 } from "../services/Vector2";
import { Settings } from "../core/config/Settings";
import { Renderer } from "../core/Renderer";
import { Node } from "./Node";

export enum NodeState {
    Normal,
    Hovered,
    Selected,
    Dragged
}

export class SidebarNode {
    state: NodeState;
    constructor(public position: Vector2, public size: Vector2, public title: string) {
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

    draw(renderer: Renderer, draggingPosition: Vector2) {
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

        renderer.rect(this.position, this.size, backgroundColor, borderColor);
        renderer.text(this.title, this.position.add(new Vector2(10, 20)), 14, Settings.Theme.Node.Text);

        if (this.state == NodeState.Dragged) {
            renderer.rect(draggingPosition, this.size, backgroundColor, borderColor, 10);
            renderer.text(this.title, draggingPosition.add(new Vector2(10, 20)), 14, Settings.Theme.Node.Text);
        }
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

    startDrag() {
        this.state = NodeState.Dragged;
    }

    stopDrag() {
        this.state = NodeState.Normal;
    }

    isDragging(): boolean {
        return this.state === NodeState.Dragged;
    }

    move(position: Vector2) {
        this.position = position
    }
}