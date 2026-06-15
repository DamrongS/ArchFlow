import { Vector2 } from "../services/Vector2";
import { Settings } from "../core/config/Settings";
import { ImageMode, Renderer } from "../core/Renderer";
import { Node } from "./Node";
import { AssetManager } from "../core/AssetManager";

export enum NodeState {
    Normal,
    Hovered,
    Selected,
    Dragged
}

export class SidebarNexus {
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

        renderer.image(AssetManager.getImage("nexus"), this.position, this.size);
        if (this.state == NodeState.Dragged) {
            renderer.image(AssetManager.getImage("nexus"), draggingPosition, this.size);
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