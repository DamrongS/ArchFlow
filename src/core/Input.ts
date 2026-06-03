import { Vector2 } from "../services/Vector2";

export class Input {

    static mousePosition = new Vector2(0, 0);
    static mouseDelta =  new Vector2(0, 0);
    static keys = new Set<string>();
    static buttons = new Set<number>();
    static wheelDelta = 0;
    static pressedButtons = new Set<any>();

    static initialize() {
        window.addEventListener("mousemove", (event) => {
            this.mouseDelta =new Vector2(event.movementX, event.movementY);
            this.mousePosition = new Vector2(event.clientX, event.clientY);
        });

        window.addEventListener("keydown", (event) => {
            console.log(`Key down: ${event.code}`);
            this.keys.add(event.code);
            this.pressedButtons.add(event.code);
        });

        window.addEventListener("keyup", (event) => {
            this.keys.delete(event.code);
        });

        window.addEventListener("mousedown", (event) => {
            this.buttons.add(event.button);
            this.pressedButtons.add(event.button);
        });

        window.addEventListener("mouseup", (event) => {
            this.buttons.delete(event.button);
        });

        window.addEventListener("wheel", (event) => {
            this.wheelDelta = event.deltaY;
        });

        window.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }

    static isKeyDown(key: string): boolean {
        return this.keys.has(key);
    }

    static isKeyPressed(key: string): boolean {
        return this.pressedButtons.has(key);
    }

    static isMouseDown(button: number): boolean {
        return this.buttons.has(button);
    }

    static isMousePressed(button: number): boolean {
        return this.pressedButtons.has(button);
    }

    static endFrame() {
        this.wheelDelta = 0;
        this.pressedButtons.clear();
    }
}