import { Node } from "./Node";
import { Renderer } from "../core/Renderer";
import { Camera } from "../core/Camera";
import { Settings } from "../core/config/Settings";

export enum ConnectionState {
    Normal,
    Hovered,
    Selected,
    Spawning
}

export class Connection {
    state: ConnectionState;
    constructor(
        public from: Node,
        public to: Node
    ) {
        this.state = ConnectionState.Normal;
    }

    select() {
        this.state = ConnectionState.Selected;
    }

    deselect() {
        this.state = ConnectionState.Normal;
    }

    hover() {
        if (this.state == ConnectionState.Spawning) return
        if (this.state !== ConnectionState.Selected) {
            this.state = ConnectionState.Hovered;
        }
    }

    unhover() {
        if (this.state == ConnectionState.Spawning) return
        if (this.state === ConnectionState.Hovered) {
            this.state = ConnectionState.Normal;
        }
    }

    draw(renderer: Renderer, camera: Camera) {
        let ConnectionColor = Settings.Theme.Connection.Line

        if (this.state === ConnectionState.Selected) {
            ConnectionColor = Settings.Theme.Connection.Selected;
        }

        if (this.state === ConnectionState.Hovered) {
            ConnectionColor = Settings.Theme.Connection.Hovered;
        }

        const fromPosition = this.from.position.add(this.from.size.div(2)).sub(camera.position).mult(camera.zoom);
        const toPosition = this.to.position.add(this.to.size.div(2)).sub(camera.position).mult(camera.zoom);

        renderer.line(fromPosition, toPosition, ConnectionColor);
    }

    containsPoint(point: Vector2): boolean {
        // A ------------------- B
        //          |
        //          |
        //          X Mouse

        // A ------ O ---------- B
        //          ^
        //          nearest point

        // you measure: distanceTo(mouse, O)
        // if distance < n Px ==> Hovered

        const start = this.from.position.add(
            this.from.size.div(2)
        );

        const end = this.to.position.add(
            this.to.size.div(2)
        );

        const line = end.sub(start)
        const mouse = point.sub(start)

        const lengthSqaured = line.dot(line)

        const t = Math.max(0, Math.min(1, mouse.dot(line) / lengthSqaured));
        const closestPoint = start.add(line.mult(t));

        const distance = point.distanceTo(closestPoint);

        return distance < 10
    }
}