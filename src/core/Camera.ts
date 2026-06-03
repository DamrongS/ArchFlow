import { Vector2 } from "../services/Vector2";

export class Camera {
    position: Vector2;
    zoom: number;

    constructor() {
        this.position = new Vector2(0, 0);
        this.zoom = 1;
    }
}